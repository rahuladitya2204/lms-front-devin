// utils/dehydration.ts
import { initializeApp } from "@Utils/index";
import { Store } from "@adewaskar/lms-common";
import { useEffect } from "react";
const SG_KEY = 'GKpmiOtoXu0V7YpohCF5CoWv2Q747fmY'
const GA_KEY = 'G-09G526DHYD'
import { AnalyticsBrowser } from '@segment/analytics-next';
import ReactGA from 'react-ga';
const analytics = AnalyticsBrowser.load({ writeKey: SG_KEY })
// const FACEBOOK_PIXEL_ID = '1215625842884170'
// import dynamic from "next/dynamic";

// const ReactPixel = dynamic(() => import('react-facebook-pixel'), {
//   ssr: false,
// });

export const initAnalytics = () => {
  ReactGA.initialize(GA_KEY);
  // ReactPixel.init(FACEBOOK_PIXEL_ID); // Replace with your Pixel ID
  // ReactPixel.pageView(); // Track initial page load

}

const useDehydration = () => {
  const isServer = typeof window === "undefined";
  const { user, learner, userType } = Store.useAuthentication(s => s);
  // console.log(user,learner,'aaaaa')
  useEffect(() => {
    if (!isServer) {
      initAnalytics();
      initializeApp();
    }
  }, [isServer]);


  useEffect(() => {
    if (learner._id) {
      console.log('Setting User ID on Segment');
      window.analytics_enabled = true;
      identifyUser(learner._id, {
        name: learner.name,
        interests: learner.interests
      })
    }
  }, [learner._id])

};

export default useDehydration;


export const LogEvent = (category, action, label, data = {}) => {
  if (category && action && window.analytics_enabled) {
    analytics.track(action, {
      category: category,
      label: label,
      ...data
    });
    ReactGA.event({ category, action, label, ...data });

  }
};

// Set User ID
const identifyUser = (userId, traits) => {
  analytics.identify(userId, traits);
  ReactGA.set({ userId });
};