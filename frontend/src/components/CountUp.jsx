import { useEffect, useRef, useState } from 'react';

const CountUp = ({ end, duration = 800, className = '' }) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Only animate once when component first receives data
    if (hasAnimatedRef.current || end === 0) {
      setCount(end);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(end);
      hasAnimatedRef.current = true;
      return;
    }

    hasAnimatedRef.current = true;
    const startValue = 0;
    const range = end - startValue;

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(startValue + range * easeProgress);

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration]);

  return <span className={className}>{count}</span>;
};

export default CountUp;