import './style.css'

import {
  LocalVideo,
  UserActivityProvider,
  VideoTileGrid
} from 'amazon-chime-sdk-component-library-react'
import { StyledContent, StyledLayout } from './Player/styled'
import { Types, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'
import { useHandleMeetingEnd, useLiveSession } from './hooks'

import MeetingControls from './Player/MeetingControls'
import NavigationControl from './Player/Navigation/NavigationControl'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

let joined = false
const LiveSessionPlayer = () => {
  const message = useMessage()
  // const [joined, setJoined] = useState(false)
  const { sessionId } = useParams()
  const { data: session } = User.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const { joinMeeting, start } = useLiveSession(sessionId + '')

  const { data: attendee } = User.Queries.useGetLiveSessionAttendeeDetails(
    sessionId + '',
    {
      enabled: !!session?.metadata?.MeetingId
    }
  )

  useHandleMeetingEnd()

  const displayRecordingAlert = (session: Types.LiveSession) => {
    console.log('jahahahaha')
    if (session.recording.enabled) {
      message.open({
        type: 'success',
        content: 'Recording Video',
        // icon: <VideoCameraOutlined />,
        duration: Infinity
      })
    }
  }

  useEffect(
    () => {
      if (session._id) {
        if (attendee?.metadata?.AttendeeId) {
          start(session, attendee)
          displayRecordingAlert(session)
        } else {
          if (!joined) {
            console.log('joining', joined)
            joined = true
            joinMeeting(session).then((attendee: any) => {
              start(session, attendee)
              displayRecordingAlert(session)
            })
          }
        }
      }
    },
    [attendee]
  )

  const meetingManager = useMeetingManager()

  useEffect(
    () => {
      console.log('destroying')
      // This function is returned by the useEffect hook and will be run when the component is unmounted.
      return () => {
        if (meetingManager.audioVideo) {
          meetingManager.audioVideo.stopLocalVideoTile()
        }
      }
    },
    [meetingManager]
  ) // Dependencies of the useEffect hook.

  return (
    <NavigationProvider>
      {/* @ts-ignore */}
      <UserActivityProvider>
        <StyledLayout showNav showRoster>
          <StyledContent>
            {/* <MeetingMetrics /> */}
            <VideoTileGrid
              className="videos"
              // noRemoteVideoView={<MeetingDetails />}
            />
            {/* <LocalVideo /> */}

            <MeetingControls />
          </StyledContent>
          <NavigationControl />
        </StyledLayout>
      </UserActivityProvider>
    </NavigationProvider>
  )
}

export default LiveSessionPlayer
