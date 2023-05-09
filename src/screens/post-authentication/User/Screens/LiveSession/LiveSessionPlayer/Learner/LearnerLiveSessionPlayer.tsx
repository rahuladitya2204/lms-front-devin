import './style.css'
import {
  VideoTileGrid,
  UserActivityProvider,
  LocalVideo
} from 'amazon-chime-sdk-component-library-react'
import { StyledContent, StyledLayout } from './Player/styled'
import MeetingControls from './Player/MeetingControls'
import NavigationControl from './Player/Navigation/NavigationControl'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Learner } from '@adewaskar/lms-common'
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js'
import { useHandleMeetingEnd, useLiveSession } from './hooks'

const LiveSessionPlayer = () => {
  const { sessionId } = useParams()
  const { data: session } = Learner.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )

  const { data: attendee } = Learner.Queries.useGetLiveSessionAttendeeDetails(
    sessionId + ''
  )
  // ... rest of the code
  // const { joinMeeting } = useLiveSession(sessionId + '')

  // useEffect(
  //   () => {
  //     if (session.metadata.MeetingId) {
  //       joinMeeting(session)
  //     }
  //   },
  //   [session]
  // )

  useHandleMeetingEnd()

  useEffect(
    () => {
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        session.metadata,
        attendee
      )
    },
    [session, attendee]
  )

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
