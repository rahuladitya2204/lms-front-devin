import {
  ConsoleLogger,
  DefaultDeviceController,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js'
import { Types, User } from '@adewaskar/lms-common'
// hooks/useDeviceController.js
import { useEffect, useState } from 'react'

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
      addAttendee(
        { session: sessionId + '' },
        {
          onSuccess: resolve
        }
      )
    })
  }

  const start = async (
    session: Types.LiveSession,
    attendee: Types.LiveSesionAttendee
  ) => {
    console.log('called', session, attendee.session)
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      session.metadata,
      attendee.metadata
    )

    await meetingManager.join(meetingSessionConfiguration)
    const res = await meetingManager.start()
    return res
  }

  return {
    joinMeeting,
    start
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
