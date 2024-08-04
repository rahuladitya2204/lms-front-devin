// utils/dehydration.ts
import { initializeApp } from "@Utils/index";
import { Store } from "@adewaskar/lms-common";
import { useEffect } from "react";
import ReactGA from 'react-ga';
const GA_KEY='G-09G526DHYD'
const useDehydration = () => {
  const isServer = typeof window === "undefined";
  const {user,learner,userType}=Store.useAuthentication(s=>s);
  // console.log(user,learner,'aaaaa')
  useEffect(() => {
    if (!isServer && process.env.NODE_ENV === 'production' && userType==='learner') {
      ReactGA.initialize(GA_KEY);
      initializeApp();
    }
  }, [isServer]);


  useEffect(()=>{
    if(learner._id){
      console.log('Setting User ID on GA')
      setUserId(learner._id)
    }
  },[learner._id])

};

export default useDehydration;


export const LogEvent = (category = '', action = '', label = '', value = 0) => {
  if (category && action) {
    ReactGA.event({ category, action, label, value });
  }
};

// Set User ID
export const setUserId = (userId) => {
  ReactGA.set({ userId });
};