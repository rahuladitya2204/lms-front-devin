import {
  ConsoleLogger,
  DefaultDeviceController,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js'
import { Learner, Types } from '@invinciblezealorg/lms-common'
// hooks/useDeviceController.js
import { useEffect, useState } from 'react'

import { VideoCameraOutlined } from '@ant-design/icons'
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react'
import useMessage from '@Hooks/useMessage'
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

export const useEvent = (eventId: string) => {
  const meetingManager = useMeetingManager()
  const message = useMessage()
  const displayRecordingAlert = (session: Types.Event) => {
    console.log('11')
    if (session.recording.enabled) {
      message.open({
        type: 'success',
        content: 'Recording Video',
        // icon: <VideoCameraOutlined />,
        duration: Infinity
      })
    }
  }
  const { mutate: addAttendee } = Learner.Queries.useAddAttendee()
  const joinMeeting = (session: any) => {
    console.log(session, 'session')

    return new Promise(resolve => {
      if (session.metadata.MeetingId) {
        addAttendee(
          { session: eventId + '' },
          {
            onSuccess: resolve
          }
        )
      }
    })
  }

  const start = async (
    session: Types.Event,
    attendee: Types.LiveSesionAttendee
  ) => {
    console.log('called', session, attendee.session)
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      session.metadata,
      attendee.metadata
    )
    await meetingManager.join(meetingSessionConfiguration)
    const res = await meetingManager.start()
    displayRecordingAlert(session)
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
