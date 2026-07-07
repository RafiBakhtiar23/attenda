const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'on_time':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'late':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status?.toLowerCase()) {
      case 'on_time':
        return 'On Time';
      case 'late':
        return 'Late';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;