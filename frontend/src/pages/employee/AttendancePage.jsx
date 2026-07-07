import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import StatusBadge from '../../components/StatusBadge';
import StatCard from '../../components/StatCard';
import CountUp from '../../components/CountUp';
import { Calendar, Clock, AlertCircle, Loader2, Search } from 'lucide-react';

const AttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/attendance/history');
      setAttendances(response.data.data || []);
    } catch (err) {
      setError('Failed to load attendance history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttendances();
  }, []);

  const calculateStats = () => {
    const total = attendances.length;
    const onTime = attendances.filter(a => a.status === 'on_time').length;
    const late = attendances.filter(a => a.status === 'late').length;
    const onTimeRate = total > 0 ? Math.round((onTime / total) * 100) : 0;
    
    return { total, onTime, late, onTimeRate };
  };

const filteredAttendances = attendances.filter(att => {
    if (!searchTerm) return true;
    const date = new Date(att.attendance_date).toLocaleDateString().toLowerCase();
    return date.includes(searchTerm.toLowerCase());
  });

  const stats = calculateStats();

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-attenda-dark mb-2">Attendance History</h1>
        <p className="text-attenda-muted">View and track your attendance records</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <StatCard title="Total" value={stats.total} icon={Calendar} />
        <StatCard title="On Time" value={stats.onTime} icon={Clock} />
        <StatCard title="Late" value={stats.late} icon={AlertCircle} />
        <div className="bg-attenda-surface border border-attenda-border rounded-card p-6">
          <p className="text-sm text-attenda-muted mb-2">On-Time Rate</p>
          <p className="text-3xl font-bold text-attenda-dark">
            <CountUp end={stats.onTimeRate} />%
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-attenda-muted" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by date..."
            className="w-full pl-12 pr-4 py-3 bg-attenda-surface border border-attenda-border rounded-card focus:outline-none focus:ring-2 focus:ring-attenda-lime focus:border-transparent"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-attenda-surface border border-attenda-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-attenda-bg border-b border-attenda-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Clock In</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Clock Out</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Status</th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-attenda-border"
              variants={{
                visible: { transition: { staggerChildren: 0.03 } },
                hidden: {},
              }}
              initial={!searchTerm ? 'hidden' : 'visible'}
              animate={'visible'}
            >
              {filteredAttendances.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan="4" className="px-6 py-12 text-center text-attenda-muted">
                    {searchTerm ? 'No matching records found' : 'No attendance records yet'}
                  </td>
                </motion.tr>
              ) : (
                filteredAttendances.map((attendance, index) => (
                  <motion.tr
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="hover:bg-attenda-bg transition-colors"
                  >
                    <td className="px-6 py-4">
<p className="font-medium text-attenda-dark">
                        {new Date(attendance.attendance_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-attenda-dark">
                      {attendance.clock_in ? 
                        new Date(attendance.clock_in).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-attenda-dark">
                      {attendance.clock_out ? 
                        new Date(attendance.clock_out).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={attendance.status} />
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <motion.div
        className="lg:hidden space-y-4"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {filteredAttendances.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-attenda-surface border border-attenda-border rounded-card p-8 text-center"
          >
            <p className="text-attenda-muted">
              {searchTerm ? 'No matching records found' : 'No attendance records yet'}
            </p>
          </motion.div>
        ) : (
          filteredAttendances.map((attendance, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-attenda-surface border border-attenda-border rounded-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
<p className="font-bold text-attenda-dark">
                    {new Date(attendance.attendance_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-attenda-muted mt-1">
                    {new Date(attendance.attendance_date).getFullYear()}
                  </p>
                </div>
                <StatusBadge status={attendance.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-attenda-border">
                <div>
                  <p className="text-xs text-attenda-muted mb-1">Clock In</p>
                  <p className="font-medium text-attenda-dark">
                    {attendance.clock_in ? 
                      new Date(attendance.clock_in).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-attenda-muted mb-1">Clock Out</p>
                  <p className="font-medium text-attenda-dark">
                    {attendance.clock_out ? 
                      new Date(attendance.clock_out).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default AttendancePage;