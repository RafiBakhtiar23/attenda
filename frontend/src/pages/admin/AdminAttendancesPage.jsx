import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import StatusBadge from '../../components/StatusBadge';
import CountUp from '../../components/CountUp';
import { Search, Loader2, AlertCircle, Filter } from 'lucide-react';

const AdminAttendancesPage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const attRes = await api.get('/admin/attendances');
      setAttendances(attRes.data.data || []);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const getEmployeeName = (attendance) => {
    return attendance.user?.full_name || 'Unknown';
  };

  const filteredAttendances = attendances.filter(att => {
    const employeeName = getEmployeeName(att).toLowerCase();
    const matchesSearch = !searchTerm || employeeName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || att.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl lg:text-4xl font-bold text-attenda-dark mb-2">Attendance Records</h1>
        <p className="text-attenda-muted">View all employee attendance records</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Stats */}
      <motion.div
        className="bg-attenda-surface border border-attenda-border rounded-card p-6 mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-attenda-lime rounded-xl">
            <Filter size={24} className="text-attenda-dark" />
          </div>
          <div>
            <p className="text-sm text-attenda-muted">Total Records</p>
            <p className="text-3xl font-bold text-attenda-dark">
              <CountUp end={attendances.length} />
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-attenda-muted" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name..."
            className="w-full pl-12 pr-4 py-3 bg-attenda-surface border border-attenda-border rounded-card focus:outline-none focus:ring-2 focus:ring-attenda-lime focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-attenda-surface border border-attenda-border rounded-card focus:outline-none focus:ring-2 focus:ring-attenda-lime focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="on_time">On Time</option>
          <option value="late">Late</option>
        </select>
      </div>

      {/* Desktop Table */}
      <motion.div
        className="hidden lg:block bg-attenda-surface border border-attenda-border rounded-card overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <table className="w-full">
          <thead className="bg-attenda-bg border-b border-attenda-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Employee</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Clock In</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Clock Out</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Status</th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-attenda-border"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.04 } }
            }}
          >
            {filteredAttendances.length === 0 ? (
              <motion.tr variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <td colSpan="5" className="px-6 py-12 text-center text-attenda-muted">
                  No attendance records found
                </td>
              </motion.tr>
            ) : (
              filteredAttendances.map((att, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-attenda-bg transition-colors"
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-attenda-dark">
                      {getEmployeeName(att)}
                    </span>
                  </td>
<td className="px-6 py-4 text-attenda-dark">
                    {new Date(att.attendance_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-attenda-dark">
                    {att.clock_in ? 
                      new Date(att.clock_in).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                  </td>
                  <td className="px-6 py-4 text-attenda-dark">
                    {att.clock_out ? 
                      new Date(att.clock_out).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={att.status} />
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </motion.div>

      {/* Mobile Cards */}
      <motion.div
        className="lg:hidden space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.07 } }
        }}
      >
        {filteredAttendances.length === 0 ? (
          <motion.div
            className="bg-attenda-surface border border-attenda-border rounded-card p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-attenda-muted">No attendance records found</p>
          </motion.div>
        ) : (
          filteredAttendances.map((att, index) => (
            <motion.div
              key={index}
              className="bg-attenda-surface border border-attenda-border rounded-card p-4"
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-attenda-dark">{getEmployeeName(att)}</p>
<p className="text-sm text-attenda-muted mt-1">
                    {new Date(att.attendance_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <StatusBadge status={att.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-attenda-border">
                <div>
                  <p className="text-xs text-attenda-muted mb-1">Clock In</p>
                  <p className="font-medium text-attenda-dark">
                    {att.clock_in ? 
                      new Date(att.clock_in).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-attenda-muted mb-1">Clock Out</p>
                  <p className="font-medium text-attenda-dark">
                    {att.clock_out ? 
                      new Date(att.clock_out).toLocaleTimeString('en-US', {
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

export default AdminAttendancesPage;