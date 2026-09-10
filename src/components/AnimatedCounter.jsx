// src/components/AnimatedCounter.jsx
import React, { useState, useEffect } from 'react';
import { useInView } from './Reveal';

/**
 * AnimatedCounter Component: Smooth numbers count-up on scroll
 */
export default function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 1400,
  className = 'tabular-nums'
}) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const endVal = typeof end === 'number' ? end : parseInt(String(end).replace(/\D/g, ''), 10) || 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // smooth easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * endVal));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };

    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
