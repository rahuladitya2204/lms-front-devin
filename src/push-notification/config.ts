import { getMessaging, getToken } from 'firebase/messaging'


export const generatePushToken = () => {
  const messaging = getMessaging();
  return getToken(messaging, {
    vapidKey:
      'BNUIyG536kFmZGT2mKwEkpYgXAI40j9ljvS1-zgE32gJ1Gt6hGZVlz51eRGx0EYG4pQLS9Fef2nRyvVcU_j_Nco'
  })
}
