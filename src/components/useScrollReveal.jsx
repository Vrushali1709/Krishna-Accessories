// src/components/useScrollReveal.jsx
import React, { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element enters the viewport.
 * Uses IntersectionObserver with fallback for older environments.
 */
export function useInView(options = { threshold: 0.08, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      } else if (!options.triggerOnce) {
        setInView(false);
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

/**
 * Reveal Component: Smooth editorial fade-up / slide-in on scroll
 * Matching the animation language of the About Us page
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.1,
  duration = 750,
  style = {}
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 32px, 0)';
      case 'down':
        return 'translate3d(0, -32px, 0)';
      case 'left':
        return 'translate3d(32px, 0, 0)';
      case 'right':
        return 'translate3d(-32px, 0, 0)';
      case 'zoom':
        return 'scale(0.95)';
      case 'none':
        return 'none';
      default:
        return 'translate3d(0, 24px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/**
 * Animated Stat Counter: Smooth numbers count-up on scroll
 */
export function AnimatedCounter({ end, suffix = '', duration = 1400 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const endVal = parseInt(end, 10);
    if (isNaN(endVal)) return;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
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
    <span ref={ref} className="tabular-nums font-bold">
      {count}
      {suffix}
    </span>
  );
}

export default Reveal;
