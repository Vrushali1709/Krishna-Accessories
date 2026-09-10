// src/context/LoadingContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const timeoutRef = useRef(null);

  // Initial luxury splash screen on first visit (smoothly unmounts after short delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const showLoading = useCallback((message = 'Loading...') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Smooth slight delay for clean visual transition
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 150);
  }, []);

  const startRouteTransition = useCallback(() => {
    setIsRouteChanging(true);
  }, []);

  const completeRouteTransition = useCallback(() => {
    // Quick ease-out completion
    setTimeout(() => {
      setIsRouteChanging(false);
    }, 300);
  }, []);

  const withLoading = useCallback(async (asyncFn, message = 'Processing...') => {
    showLoading(message);
    try {
      return await asyncFn();
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const value = {
    isLoading,
    loadingMessage,
    isRouteChanging,
    initialLoading,
    showLoading,
    hideLoading,
    startRouteTransition,
    completeRouteTransition,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
