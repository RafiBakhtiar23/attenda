import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import CountUp from '../../components/CountUp';
import { Users, Search, Loader2, AlertCircle, Mail, Shield, Plus, X, Power, PowerOff, AlertTriangle } from 'lucide-react';

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      // Keep loading spinner only on initial load
      if (employees.length === 0) setLoading(true);
      setError('');
      const response = await api.get('/admin/employees');
      setEmployees(response.data.data || []);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredEmployees = employees.filter(emp => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      emp.full_name?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term)
    );
  });

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium">Admin</span>
      : <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">Employee</span>;
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? <span className="inline-flex items-center gap-2 text-sm text-green-700">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Active
        </span>
      : <span className="inline-flex items-center gap-2 text-sm text-red-700">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          Inactive
        </span>;
  };

  const handleOpenConfirmModal = (employee) => {
    setSelectedEmployee(employee);
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedEmployee(null);
    setConfirmModalOpen(false);
  };

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
        className="flex flex-col md:flex-row md:justify-between md:items-center mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-attenda-dark mb-2">Employees</h1>
          <p className="text-attenda-muted">Manage employee accounts</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-attenda-dark text-white px-4 py-2 mt-4 md:mt-0 rounded-card flex items-center gap-2 hover:bg-gray-800 transition-colors self-start"
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Header Stats */}
      <motion.div
        className="bg-attenda-surface border border-attenda-border rounded-card p-6 mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-attenda-lime rounded-xl">
            <Users size={24} className="text-attenda-dark" />
          </div>
          <div>
            <p className="text-sm text-attenda-muted">Total Employees</p>
            <p className="text-3xl font-bold text-attenda-dark">
              <CountUp end={employees.length} />
            </p>
          </div>
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
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-attenda-surface border border-attenda-border rounded-card focus:outline-none focus:ring-2 focus:ring-attenda-lime focus:border-transparent"
          />
        </div>
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
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Role</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-attenda-dark">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-attenda-border"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {filteredEmployees.length === 0 ? (
              <motion.tr variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <td colSpan="5" className="px-6 py-12 text-center text-attenda-muted">
                  {searchTerm ? 'No employees found' : 'No employees yet'}
                </td>
              </motion.tr>
            ) : (
              filteredEmployees.map((employee) => (
                <motion.tr
                  key={employee.ID}
                  className="hover:bg-attenda-bg transition-colors"
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-attenda-lime flex items-center justify-center text-attenda-dark font-bold text-sm">
                        {getInitials(employee.full_name)}
                      </div>
                      <span className="font-medium text-attenda-dark">{employee.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-attenda-dark">{employee.email}</td>
                  <td className="px-6 py-4">{getRoleBadge(employee.role)}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(employee.is_active)}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleOpenConfirmModal(employee)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        employee.is_active 
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {employee.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                      {employee.is_active ? 'Deactivate' : 'Activate'}
                    </button>
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
        {filteredEmployees.length === 0 ? (
          <motion.div
            className="bg-attenda-surface border border-attenda-border rounded-card p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-attenda-muted">
              {searchTerm ? 'No employees found' : 'No employees yet'}
            </p>
          </motion.div>
        ) : (
          filteredEmployees.map((employee) => (
            <motion.div
              key={employee.ID}
              className="bg-attenda-surface border border-attenda-border rounded-card p-4"
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-attenda-lime flex items-center justify-center text-attenda-dark font-bold">
                  {getInitials(employee.full_name)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-attenda-dark">{employee.full_name}</p>
                  {getRoleBadge(employee.role)}
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-attenda-border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-attenda-muted" />
                  <span className="text-attenda-dark">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield size={16} className="text-attenda-muted" />
                  {getStatusBadge(employee.is_active)}
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => handleOpenConfirmModal(employee)}
                    className={`flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      employee.is_active 
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {employee.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                    {employee.is_active ? 'Deactivate Account' : 'Activate Account'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          fetchEmployees();
        }}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={fetchEmployees}
        employee={selectedEmployee}
        setError={setError}
      />
    </motion.div>
  );
};

const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({ fullName: '', email: '', password: '' });
      setFormError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      await api.post('/admin/employees', {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      onSuccess();
    } catch (err) {
      if (err.response?.status === 409) {
        setFormError('Email already exists.');
      } else if (err.response?.status === 400) {
        setFormError('Invalid data. Please check the fields and try again.');
      } else {
        setFormError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-attenda-surface border border-attenda-border rounded-card w-full max-w-md p-6"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-attenda-dark">Add New Employee</h2>
          <button onClick={onClose} className="text-attenda-muted hover:text-attenda-dark p-1 rounded-full hover:bg-attenda-bg">
            <X size={24} />
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-attenda-dark block mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-attenda-bg border border-attenda-border rounded-lg focus:outline-none focus:ring-2 focus:ring-attenda-lime"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-attenda-dark block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-attenda-bg border border-attenda-border rounded-lg focus:outline-none focus:ring-2 focus:ring-attenda-lime"
                placeholder="employee@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-attenda-dark block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-attenda-bg border border-attenda-border rounded-lg focus:outline-none focus:ring-2 focus:ring-attenda-lime"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-attenda-border text-attenda-dark rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-attenda-dark text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              <span>{isSubmitting ? 'Creating...' : 'Create Employee'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, employee, setError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const action = employee?.is_active ? 'Deactivate' : 'Activate';
  const targetStatus = !employee?.is_active;

  const handleSubmit = async () => {
    if (!employee) return;
    setIsSubmitting(true);
    setError('');
    try {
      await api.patch(`/admin/employees/${employee.ID}/status`, {
        is_active: targetStatus,
      });
      onClose(); // Close the modal first
      onConfirm(); // Then trigger the refresh
    } catch (err) {
      setError(`Failed to ${action.toLowerCase()} employee. Please try again.`);
      console.error(err);
      onClose(); // Also ensure the modal closes on error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-attenda-surface border border-attenda-border rounded-card w-full max-w-md p-6"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-attenda-dark">{action} Employee</h2>
          <button onClick={onClose} className="text-attenda-muted hover:text-attenda-dark p-1 rounded-full hover:bg-attenda-bg">
            <X size={24} />
          </button>
        </div>

        <div className="text-center py-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            targetStatus ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <AlertTriangle size={32} className={targetStatus ? 'text-green-600' : 'text-red-600'} />
          </div>
          <p className="mt-4 text-attenda-dark">
            Are you sure you want to {action.toLowerCase()} the account for <span className="font-bold">{employee?.full_name}</span>?
          </p>
          <p className="text-sm text-attenda-muted mt-2">
            {targetStatus
              ? 'The user will be able to log in and use the system again.'
              : 'The user will no longer be able to log in.'
            }
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-attenda-border text-attenda-dark rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px] ${
              targetStatus
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>{isSubmitting ? 'Submitting...' : action}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminEmployeesPage;