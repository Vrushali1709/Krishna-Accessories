// src/components/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const isAdminPage = pathname.startsWith('/admin');

  // Reset the document for both route changes and filter/query navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const adminScroll = document.getElementById('admin-main-scroll');
    if (adminScroll) {
      adminScroll.scrollTop = 0;
    }
  }, [pathname, search]);

  // 2. Track scroll position to show/hide the floating button on storefront pages
  useEffect(() => {
    if (isAdminPage) return;

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isAdminPage]);

  // 3. Scroll handler when user clicks the floating button
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  if (isAdminPage) return null;

  return (
    <>
      {/* Floating Scroll to Top Button */}
      {isVisible && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll back to top"
          title="Scroll to Top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-xl transition-all duration-200 hover:bg-[#111827] hover:text-white hover:border-[#111827] hover:scale-110 active:scale-95 cursor-pointer group animate-fade-in"
        >
          <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </>
  );
}

