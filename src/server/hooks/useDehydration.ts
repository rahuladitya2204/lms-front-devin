// utils/dehydration.ts
import { initializeApp } from "@Utils/index";
import { Learner, Store } from "@adewaskar/lms-common";
import { useEffect } from "react";
const SG_KEY = 'GKpmiOtoXu0V7YpohCF5CoWv2Q747fmY'
const GA_KEY = 'G-09G526DHYD'
import { AnalyticsBrowser } from '@segment/analytics-next';
import ReactGA from 'react-ga';
import { getIsServer } from "@ServerUtils/index";
let analytics;
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from "history";
const browserHistory = createBrowserHistory({ basename: '' });
var reactPlugin = new ReactPlugin();
let appInsights;
// const FACEBOOK_PIXEL_ID = '1215625842884170'
// import dynamic from "next/dynamic";

// const ReactPixel = dynamic(() => import('react-facebook-pixel'), {
//   ssr: false,
// });

export const initAnalytics = () => {
  ReactGA.initialize(GA_KEY);
  analytics = AnalyticsBrowser.load({ writeKey: SG_KEY })
  // ReactPixel.init(FACEBOOK_PIXEL_ID); // Replace with your Pixel ID
  // ReactPixel.pageView(); // Track initial page load

  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: '695456fb-3b4c-4ce9-9e57-c159c31d728e',
      extensions: [reactPlugin],
      extensionConfig: {
        [reactPlugin.identifier]: { history: browserHistory }
      }
    }
  });

}

const useDehydration = () => {
  const isServer = typeof window === "undefined";
  const { user, learner, userType } = Store.useAuthentication(s => s);
  Learner.Queries.useGetTexts();
  // console.log(user,learner,'aaaaa')
  useEffect(() => {
    if (!isServer) {
      initAnalytics();
      initializeApp();
    }
  }, [isServer]);


  useEffect(() => {
    const isServer = getIsServer();
    if (learner._id) {
      console.log('Setting User ID on Segment');
      window.analytics_enabled = true;
      identifyUser(learner._id, {
        name: learner.name,
        interests: learner.interests
      })
      appInsights.loadAppInsights();
    }
  }, [learner._id, isServer])

};

export default useDehydration;


export const LogEvent = (category, action, label, data = {}) => {
  if (category && action && window.analytics_enabled && analytics) {
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