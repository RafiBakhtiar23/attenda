import { useState, useEffect } from 'react';

const LiveClock = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={className}>
      <div className="text-5xl md:text-6xl font-bold tracking-tight">
        {formatTime(time)}
      </div>
      <div className="text-sm md:text-base text-attenda-muted mt-2">
        {formatDate(time)}
      </div>
    </div>
  );
};

export default LiveClock;