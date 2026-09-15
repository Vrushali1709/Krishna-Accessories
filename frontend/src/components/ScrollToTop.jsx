// src/components/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Reset the document for both route changes and filter/query navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  // 2. Track scroll position to show/hide the floating button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 3. Scroll handler when user clicks the floating button
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Floating Scroll to Top Button */}
      {isVisible && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll back to top"
          title="Scroll to Top"
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-lg transition duration-200 hover:bg-[#111827] hover:text-white active:scale-95"
        >
          <span className="text-xs font-bold">
            ▲
          </span>
        </button>
      )}
    </>
  );
}
