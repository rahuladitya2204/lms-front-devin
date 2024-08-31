import { getMessaging, getToken } from 'firebase/messaging'

// import { getAnalytics, isSupported } from 'firebase/analytics'
// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app'

// Add the public key generated from the console here.
export const generatePushToken = () => {
  const messaging = getMessaging();
  return getToken(messaging, {
    vapidKey:
      'BNUIyG536kFmZGT2mKwEkpYgXAI40j9ljvS1-zgE32gJ1Gt6hGZVlz51eRGx0EYG4pQLS9Fef2nRyvVcU_j_Nco'
  })
}


// Initialize Firebase
// const app = initializeApp(firebaseConfig)
// const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

