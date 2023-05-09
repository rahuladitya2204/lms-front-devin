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
import { useNavigate } from 'react-router'

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

export const useHandleMeetingEnd = (onMeetingEnd?: any) => {
  const meetingManager = useMeetingManager()
  const navigate = useNavigate()
  useEffect(
    () => {
      if (!meetingManager?.meetingSession) {
        return
      }

      const observer = {
        audioVideoDidStop: (sessionStatus: any) => {
          if (sessionStatus.statusCode() === sessionStatus.statusCode().Ended) {
            console.log('The meeting was ended for all attendees')
            navigate('../ended')
            onMeetingEnd && onMeetingEnd()
          } else {
            // navigate('../ended')
          }
        }
      }

      meetingManager.meetingSession.audioVideo.addObserver(observer)

      return () => {
        // @ts-ignore
        meetingManager?.meetingSession?.audioVideo?.removeObserver(observer)
      }
    },
    [meetingManager, onMeetingEnd]
  )
}
