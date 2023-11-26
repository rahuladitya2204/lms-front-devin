import { getMessaging, getToken } from 'firebase/messaging'

import { getAnalytics } from 'firebase/analytics'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

// Add the public key generated from the console here.
export const generatePushToken = () => {
  const messaging = getMessaging()
  return getToken(messaging, {
    vapidKey:
      'BNUIyG536kFmZGT2mKwEkpYgXAI40j9ljvS1-zgE32gJ1Gt6hGZVlz51eRGx0EYG4pQLS9Fef2nRyvVcU_j_Nco'
  })
}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA_H0duEHO6vjMAWVcnIPHQY-0Y_dTECoM',
  authDomain: 'nimble-bee.firebaseapp.com',
  projectId: 'nimble-bee',
  storageBucket: 'nimble-bee.appspot.com',
  messagingSenderId: '837664872568',
  appId: '1:837664872568:web:374fde6244593b2f16b58d',
  measurementId: 'G-VD42TCV4KF'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
