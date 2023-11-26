import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect, useState } from 'react'

import { Learner } from '@adewaskar/lms-common'
import { generatePushToken } from './config'

export const usePushNotification = (isSignedIn: boolean) => {
  const {
    mutate: addToken
    // isLoading: updatingProfile
    // @ts-ignore
  } = Learner.Queries.useAddPushNotificationToken()
  //   const [token, setToken] = useState('')
  useEffect(
    () => {
      if (isSignedIn) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            if (registrations.length > 0) {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  console.log('Notification permission granted.')
                  generatePushToken().then(TOKEN => {
                    console.log(TOKEN, 'token')
                    addToken({ token: TOKEN })
                  })
                }
              })

              const messaging = getMessaging()
              onMessage(messaging, payload => {
                console.log('Message received. ', payload)
                // ...
              })
            } else {
              console.log('No service worker is registered.')
            }
          })
        } else {
          console.log('Service workers are not supported in this browser.')
        }
      }
    },
    [isSignedIn]
  )
}
