// src/components/TopProgressBar.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

export default function TopProgressBar() {
  const location = useLocation();
  const { isRouteChanging } = useLoading();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // When location changes or route changing state starts
    setVisible(true);
    setProgress(25);

    const t1 = setTimeout(() => setProgress(65), 100);
    const t2 = setTimeout(() => setProgress(90), 250);
    const t3 = setTimeout(() => {
      setProgress(100);
      const t4 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(t4);
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.key, location.pathname, isRouteChanging]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
      aria-label="Page loading progress"
    >
      <div
        className="h-[2.5px] w-full bg-gradient-to-r from-amber-600 via-amber-300 to-yellow-200 transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.8), 0 0 4px rgba(251, 191, 36, 0.9)'
        }}
      >
        {/* Glow head point */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-200 blur-[2px] opacity-80" />
      </div>
    </div>
  );
}
