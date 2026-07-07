import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import CountUp from '../../components/CountUp';
import { Users, Clock, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';

const AdminDashboardPage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const attRes = await api.get('/admin/attendances');
      setAttendances(attRes.data.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  };

  const todayAttendances = attendances.filter(att => isToday(att.attendance_date));

  const calculateStats = () => {
    const presentToday = todayAttendances.length;
    const lateToday = todayAttendances.filter(att => att.status === 'late').length;
    const onTimeToday = todayAttendances.filter(att => att.status === 'on_time').length;
    const onTimeRate = presentToday > 0 ? Math.round((onTimeToday / presentToday) * 100) : 0;
    
    const totalEmployees = new Set(attendances.map(att => att.user_id)).size;

    return {
      totalEmployees,
      presentToday,
      lateToday,
      onTimeRate
    };
  };

  const getTodayActivity = () => {
    return todayAttendances
      .slice(0, 8)
      .map(att => ({ ...att, employeeName: att.user?.full_name || 'Unknown' }));
  };

  const stats = calculateStats();
  const todayActivity = getTodayActivity();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-attenda-dark" />
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-attenda-dark mb-2">Admin Dashboard</h1>
        <p className="text-attenda-muted">Overview of attendance and employee metrics</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
      >
        <StatCard
          title="Total Attendance Today"
          value={stats.totalEmployees}
          icon={Users}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={Clock}
        />
        <StatCard
          title="Late Today"
          value={stats.lateToday}
          icon={AlertCircle}
        />
        <motion.div
          className="bg-attenda-surface border border-attenda-border rounded-card p-6"
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-attenda-muted">On-Time Rate</p>
            <TrendingUp className="text-attenda-muted" size={20} />
          </div>
          <p className="text-3xl font-bold text-attenda-dark">
            <CountUp end={stats.onTimeRate} />%
          </p>
        </motion.div>
      </motion.div>

      {/* Today's Activity */}
      <motion.div
        className="bg-attenda-surface border border-attenda-border rounded-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      >
        <h3 className="text-lg font-bold text-attenda-dark mb-6">Today's Activity</h3>
        
        {todayActivity.length === 0 ? (
          <motion.p
            className="text-center text-attenda-muted py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No attendance records for today
          </motion.p>
        ) : (
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {todayActivity.map((att, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 border border-attenda-border rounded-xl hover:bg-attenda-bg transition-colors"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex-1">
                  <p className="font-medium text-attenda-dark">{att.employeeName}</p>
                  <p className="text-sm text-attenda-muted mt-1">
                    Clock in: {att.clock_in ?
                      new Date(att.clock_in).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                  </p>
                </div>
                <StatusBadge status={att.status} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboardPage;