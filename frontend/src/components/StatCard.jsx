import { motion } from 'framer-motion';
import CountUp from './CountUp';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="bg-attenda-surface border border-attenda-border rounded-card p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-attenda-muted mb-2">{title}</p>
          <p className="text-3xl font-bold text-attenda-dark">
            <CountUp end={value} />
          </p>
          {trend && (
            <p className="text-xs text-attenda-muted mt-2">{trend}</p>
          )}
        </div>
        {Icon && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="ml-4 p-3 bg-attenda-bg rounded-xl"
          >
            <Icon className="w-5 h-5 text-attenda-dark" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;