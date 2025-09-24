import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  showLoading: (duration?: number) => Promise<void>;
  hideLoading: () => void;
}

export const useLoading = (): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback((duration: number = 500): Promise<void> => {
    return new Promise((resolve) => {
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, duration);
    });
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    showLoading,
    hideLoading
  };
};
