import './style.css'

import { Learner, Types } from '@adewaskar/lms-common'
import {
  LocalVideo,
  UserActivityProvider,
  VideoTileGrid
} from 'amazon-chime-sdk-component-library-react'
import { StyledContent, StyledLayout } from './Player/styled'
import { useHandleMeetingEnd, useLiveSession } from './hooks'

import MeetingControls from './Player/MeetingControls'
import NavigationControl from './Player/Navigation/NavigationControl'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import { useEffect } from 'react'
import { useParams } from 'react-router'

const LiveSessionPlayer = () => {
  const { sessionId } = useParams()
  const { data: session } = Learner.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const { joinMeeting, start } = useLiveSession(sessionId + '')

  const { data: attendee } = Learner.Queries.useGetLiveSessionAttendeeDetails(
    sessionId + ''
  )

  useHandleMeetingEnd()

  useEffect(
    () => {
      // console.log(session.metadata.MeetingId, 'triggered')
      console.log(session, attendee, 'attendee')
      if (session?.metadata?.MeetingId) {
        if (attendee?.metadata?.AttendeeId) {
          start(session, attendee)
        } else {
          joinMeeting(session).then((attendee: any) => {
            start(session, attendee)
          })
        }
      }
    },
    [session, attendee]
  )

  useEffect(() => {}, [attendee])

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
