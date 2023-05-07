// hooks/useDeviceController.js
import { useEffect, useState } from 'react'
import {
  DefaultDeviceController,
  ConsoleLogger,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js'
import { User } from '@adewaskar/lms-common'
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react'

const useDeviceController = () => {
  const [deviceController, setDeviceController] = useState(null)

  useEffect(() => {
    const initDeviceController = async () => {
      const logger = new ConsoleLogger('MyLogger', LogLevel.INFO)
      const deviceController = new DefaultDeviceController(logger)
      // @ts-ignore
      setDeviceController(deviceController)
    }

    initDeviceController()
  }, [])

  return deviceController
}

export default useDeviceController

export const useLiveSession = (sessionId: string) => {
  const meetingManager = useMeetingManager()
  const { mutate: addAttendee } = User.Queries.useAddAttendee()
  const joinMeeting = (session: any) => {
    console.log(session, 'session')

    return new Promise(resolve => {
      if (session.metadata.MeetingId) {
        addAttendee(
          { session: sessionId + '' },
          {
            onSuccess: async data => {
              console.log(session.metadata, data.Attendee, '11111111')
              const meetingSessionConfiguration = new MeetingSessionConfiguration(
                session.metadata,
                data.Attendee
              )
              await meetingManager.join(meetingSessionConfiguration)
              const res = await meetingManager.start()
              resolve(res)
            }
          }
        )
      }
    })
  }

  return {
    joinMeeting
  }
}
