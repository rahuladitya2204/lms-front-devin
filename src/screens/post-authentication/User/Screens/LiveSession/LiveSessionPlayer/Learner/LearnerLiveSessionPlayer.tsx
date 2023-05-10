import './style.css'

import { Learner, Types } from '@adewaskar/lms-common'
import {
  LocalVideo,
  UserActivityProvider,
  VideoTileGrid
} from 'amazon-chime-sdk-component-library-react'
import { StyledContent, StyledLayout } from './Player/styled'
import { useEffect, useState } from 'react'
import { useHandleMeetingEnd, useLiveSession } from './hooks'

import MeetingControls from './Player/MeetingControls'
import NavigationControl from './Player/Navigation/NavigationControl'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import { useParams } from 'react-router'

let joined = false;
const LiveSessionPlayer = () => {
  // const [joined, setJoined] = useState(false)
  const { sessionId } = useParams()
  const { data: session } = Learner.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const { joinMeeting, start } = useLiveSession(sessionId + '')

  const { data: attendee } = Learner.Queries.useGetLiveSessionAttendeeDetails(
    sessionId + '',
    {
      enabled: !!session?.metadata?.MeetingId
    }
  )

  useHandleMeetingEnd()

  useEffect(
    () => {
      if (session._id) {
        if (attendee?.metadata?.AttendeeId) {
          start(session, attendee)
        } else {
          if (!joined) {
            console.log('joining', joined);
            joined = true;
            joinMeeting(session).then((attendee: any) => {
              start(session, attendee)
            })
          }
        }
      }
    },
    [attendee]
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
