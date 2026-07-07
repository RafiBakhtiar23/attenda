import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import api from '../../api/api';
import LiveClock from '../../components/LiveClock';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, Clock, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [todayAttendance, setTodayAttendance] = useState(null);
  const heroRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    if (!loading && heroRef.current && visualRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(heroRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: 'power2.out'
        });
        gsap.from(visualRef.current, {
          scale: 0.92,
          opacity: 0,
          duration: 0.6,
          delay: 0.1,
          ease: 'power2.out'
        });
        gsap.from(visualRef.current.children, {
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.3,
          ease: 'power2.out'
        });
      });
      return () => ctx.revert();
    }
  }, [loading]);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/attendance/history');
      setAttendances(response.data.data || []);
      
// Find today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = (response.data.data || []).find(
        att => att.attendance_date?.split('T')[0] === today
      );
      setTodayAttendance(todayRecord || null);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttendances();
  }, []);

  const handleClockIn = async () => {
    try {
      setActionLoading(true);
      setError('');
      await api.post('/clock-in');
      await fetchAttendances();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clock in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setActionLoading(true);
      setError('');
      await api.post('/clock-out');
      await fetchAttendances();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clock out');
    } finally {
      setActionLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateStats = () => {
    const total = attendances.length;
    const onTime = attendances.filter(a => a.status === 'on_time').length;
    const late = attendances.filter(a => a.status === 'late').length;
    const onTimeRate = total > 0 ? Math.round((onTime / total) * 100) : 0;
    
    return { total, onTime, late, onTimeRate };
  };

  const stats = calculateStats();
  const recentAttendances = attendances.slice(0, 5);

  const getAttendanceState = () => {
    if (!todayAttendance) return 'not_started';
    if (todayAttendance.clock_out) return 'completed';
    return 'in_progress';
  };

  const attendanceState = getAttendanceState();

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-attenda-dark" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-attenda-lime flex items-center justify-center text-attenda-dark font-bold text-lg">
            {getInitials(user?.full_name)}
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-attenda-dark">
              {getGreeting()}, {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-attenda-muted mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Main Clock Card */}
      <div className="bg-attenda-dark text-white rounded-card-lg p-8 lg:p-10 mb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div ref={heroRef}>
            <LiveClock className="mb-6" />
            
            {attendanceState === 'not_started' && (
              <div>
                <p className="text-white/70 mb-4">Ready to start your day?</p>
                <motion.button
                  onClick={handleClockIn}
                  disabled={actionLoading}
                  whileHover={{ scale: actionLoading ? 1 : 1.02 }}
                  whileTap={{ scale: actionLoading ? 1 : 0.97 }}
                  className="bg-attenda-lime text-attenda-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-attenda-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Clock size={20} />
                      Clock In
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {attendanceState === 'in_progress' && (
              <div>
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-1">Clocked in at</p>
                  <p className="text-2xl font-bold">
                    {todayAttendance?.clock_in ? 
                      new Date(todayAttendance.clock_in).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                  </p>
                </div>
                <motion.button
                  onClick={handleClockOut}
                  disabled={actionLoading}
                  whileHover={{ scale: actionLoading ? 1 : 1.02 }}
                  whileTap={{ scale: actionLoading ? 1 : 0.97 }}
                  className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Clock size={20} />
                      Clock Out
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {attendanceState === 'completed' && (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Clock In</p>
                    <p className="text-lg font-bold">
                      {todayAttendance?.clock_in ? 
                        new Date(todayAttendance.clock_in).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">Clock Out</p>
                    <p className="text-lg font-bold">
                      {todayAttendance?.clock_out ? 
                        new Date(todayAttendance.clock_out).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center justify-center" ref={visualRef}>
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-white/5 rounded-full"></div>
              <div className="absolute inset-8 bg-white/5 rounded-full"></div>
              <div className="absolute inset-16 bg-white/10 rounded-full flex items-center justify-center">
                <Clock size={64} className="text-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        <StatCard
          title="Total Attendance"
          value={stats.total}
          icon={Calendar}
        />
        <StatCard
          title="On Time"
          value={stats.onTime}
          icon={Clock}
        />
        <StatCard
          title="Late"
          value={stats.late}
          icon={AlertCircle}
        />
      </motion.div>

      {/* On-Time Rate */}
      <div className="bg-attenda-surface border border-attenda-border rounded-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-attenda-dark">On-Time Rate</h3>
          <TrendingUp className="text-attenda-muted" size={20} />
        </div>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-bold text-attenda-dark">{stats.onTimeRate}%</span>
          <span className="text-attenda-muted mb-1">performance</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-attenda-lime h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.onTimeRate}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-attenda-surface border border-attenda-border rounded-card p-6">
        <h3 className="text-lg font-bold text-attenda-dark mb-6">Recent Attendance</h3>
        
        {recentAttendances.length === 0 ? (
          <p className="text-center text-attenda-muted py-8">No attendance records yet</p>
        ) : (
          <div className="space-y-3">
            {recentAttendances.map((attendance, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-attenda-border rounded-xl hover:bg-attenda-bg transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-attenda-dark">
{attendance.attendance_date ? new Date(attendance.attendance_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    }) : '-'}
                  </p>
                  <p className="text-sm text-attenda-muted mt-1">
                    {attendance.clock_in ? 
                      new Date(attendance.clock_in).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'} 
                    {attendance.clock_out && ` - ${new Date(attendance.clock_out).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`}
                  </p>
                </div>
                <StatusBadge status={attendance.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;