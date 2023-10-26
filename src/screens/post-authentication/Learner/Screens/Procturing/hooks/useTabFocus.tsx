// @ts-nocheck
import { useEffect } from 'react';

export const useTabFocus = (isProctoring, handleViolation) => {
  useEffect(() => {
    if (isProctoring) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          handleViolation('Focus Lost', 'Please stay on the exam tab.');
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isProctoring, handleViolation]);
};
