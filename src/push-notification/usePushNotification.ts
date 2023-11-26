import { useEffect, useState } from 'react'

import { Learner } from '@adewaskar/lms-common'
import { generatePushToken } from './config'

export const usePushNotification = () => {
  const {
    mutate: addToken
    // isLoading: updatingProfile
    // @ts-ignore
  } = Learner.Queries.useAddPushNotificationToken()
  //   const [token, setToken] = useState('')
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.')
        generatePushToken().then(TOKEN => {
          console.log(TOKEN, 'token')
          addToken({ token: TOKEN })
        })
      }
    })
  }, [])
}
