import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Mail, Shield, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const getRoleBadge = (role) => {
    const styles = role === 'admin' 
      ? 'bg-purple-50 text-purple-700 border-purple-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles}`}>
        {role === 'admin' ? 'Administrator' : 'Employee'}
      </span>
    );
  };

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-4xl mx-auto"
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
        <h1 className="text-3xl lg:text-4xl font-bold text-attenda-dark mb-2">Profile</h1>
        <p className="text-attenda-muted">View your account information</p>
      </motion.div>

      <motion.div
        className="bg-attenda-surface border border-attenda-border rounded-card-lg p-8 mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-attenda-border">
          <motion.div
            className="w-24 h-24 rounded-full bg-attenda-lime flex items-center justify-center text-attenda-dark font-bold text-3xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            {getInitials(user?.full_name)}
          </motion.div>
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-attenda-dark mb-2">{user?.full_name}</h2>
            <div className="flex flex-col md:flex-row items-center gap-3">
              {getRoleBadge(user?.role)}
              <span className="inline-flex items-center gap-2 text-sm text-green-700">
                <CheckCircle size={16} />
                Active
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } }
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <label className="block text-sm font-medium text-attenda-muted mb-2">Full Name</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-attenda-bg rounded-card">
              <Shield className="text-attenda-muted" size={20} />
              <span className="text-attenda-dark font-medium">{user?.full_name}</span>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <label className="block text-sm font-medium text-attenda-muted mb-2">Email Address</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-attenda-bg rounded-card">
              <Mail className="text-attenda-muted" size={20} />
              <span className="text-attenda-dark font-medium">{user?.email}</span>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <label className="block text-sm font-medium text-attenda-muted mb-2">Role</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-attenda-bg rounded-card">
              <Shield className="text-attenda-muted" size={20} />
              <span className="text-attenda-dark font-medium capitalize">{user?.role}</span>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <label className="block text-sm font-medium text-attenda-muted mb-2">Account Status</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-attenda-bg rounded-card">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-attenda-dark font-medium">Active</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-card p-4 text-sm text-blue-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <p className="font-medium mb-1">Profile Information</p>
        <p>Your profile information is managed by your administrator. Contact them for any changes.</p>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;