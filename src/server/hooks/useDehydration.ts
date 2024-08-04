// utils/dehydration.ts
import { initializeApp } from "@Utils/index";
import { Store } from "@adewaskar/lms-common";
import { useEffect } from "react";
const GA_KEY='GKpmiOtoXu0V7YpohCF5CoWv2Q747fmY'
import { AnalyticsBrowser } from '@segment/analytics-next';

const analytics = AnalyticsBrowser.load({ writeKey: GA_KEY })


const useDehydration = () => {
  const isServer = typeof window === "undefined";
  const {user,learner,userType}=Store.useAuthentication(s=>s);
  // console.log(user,learner,'aaaaa')
  useEffect(() => {
    if (!isServer && process.env.NODE_ENV === 'production' && userType==='learner') {
      window.analytics_enabled=true;
      initializeApp();
    }
  }, [isServer]);


  useEffect(()=>{
    if(learner._id){
      console.log('Setting User ID on Segment')
      identifyUser(learner._id,{
        name: learner.name,
        interests: learner.interests
      })
    }
  },[learner._id])

};

export default useDehydration;


export const LogEvent = (category,action, label,data={}) => {
  if (category && action && window.analytics_enabled) {
    analytics.track(action, {
      category: category,
      label: label,
      ...data
      // value: value, // Optional
    });
  }
};

// Set User ID
const identifyUser = (userId, traits) => {
  analytics.identify(userId, traits);
};