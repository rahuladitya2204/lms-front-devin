/**
 * Dynamic imports utility for @adewaskar/lms-common package
 * This helps reduce the initial bundle size and improve FCP
 */
import { lazy } from 'react';

export const lazyLoadCommon = () => import('@adewaskar/lms-common');

export const lazyLoadStore = () => import('@adewaskar/lms-common').then(module => module.Store);
export const lazyLoadLearner = () => import('@adewaskar/lms-common').then(module => module.Learner);
export const lazyLoadUtils = () => import('@adewaskar/lms-common').then(module => module.Utils);
export const lazyLoadEnum = () => import('@adewaskar/lms-common').then(module => module.Enum);
export const lazyLoadTypes = () => import('@adewaskar/lms-common').then(module => module.Types);
export const lazyLoadConstants = () => import('@adewaskar/lms-common').then(module => module.Constants);

export const preloadCommon = () => {
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        lazyLoadCommon();
      });
    } else {
      setTimeout(() => {
        lazyLoadCommon();
      }, 2000);
    }
  }
};
