import {
  AudioInputControl,
  AudioOutputControl,
  ContentShareControl,
  ControlBar,
  Roster,
  VideoGrid,
  VideoInputControl,
  VideoTile,
  VideoTileGrid,
  useMeetingManager,
  useRosterState
} from 'amazon-chime-sdk-component-library-react'
import { useEffect, useState } from 'react'

import { Learner } from '@adewaskar/lms-common'
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js'
import styled from 'styled-components'
import { useParams } from 'react-router'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; // Change from 100% to 100vh
`


const RosterWrapper = styled.div`
  flex: 1;
`;

const ControlBarWrapper = styled.div`
  background-color: #131c21;
  padding: 1rem;
`;

const VideoGridWrapper = styled.div`
  flex: 1;
  position: relative;
  background-color: black;
  display: flex;
  flex-wrap: wrap;
  height: 100%; // Add this line
`

const LearnerLiveSessionPlayer = () => {
  const { mutate: startSession } = Learner.Queries.useStartLiveSession()
  const { sessionId } = useParams()
  const meetingManager = useMeetingManager()
  const { mutate: addAttendee } = Learner.Queries.useAddAttendee()
  const { data: session } = Learner.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const { roster } = useRosterState()

  const [hasJoinedMeeting, setHasJoinedMeeting] = useState(false)

  useEffect(
    () => {
      startSession({ session: sessionId + '' })
    },
    [sessionId]
  )

  const joinMeeting = async () => {
    addAttendee(
      { session: sessionId + '' },
      {
        onSuccess: async data => {
          console.log(data, session, 'taaa')
          const meetingSessionConfiguration = new MeetingSessionConfiguration(
            session.metadata,
            data.Attendee
          )

          await meetingManager.join(meetingSessionConfiguration)
          await meetingManager.start()
          console.log('Meeting manager started')
        }
      }
    )
  }

  const handleJoinMeeting = async () => {
    await joinMeeting()
    setHasJoinedMeeting(true)
    console.log('Joined the meeting')
  }

  return (
    <Container>
      {!hasJoinedMeeting && <button onClick={handleJoinMeeting}>Join</button>}
      {hasJoinedMeeting && (
        <>
          <RosterWrapper>
            <Roster />
          </RosterWrapper>
          <VideoGridWrapper>
          <VideoGrid>
    <VideoTileGrid
      // style={{
      //   border: '1px solid grey',
      //   gridArea: '',
      // }}
      // nameplate="Tile 1"
    />
  </VideoGrid>
          </VideoGridWrapper>
          <ControlBarWrapper>
            <ControlBar showLabels layout="undocked-horizontal">
              <AudioInputControl />
              <AudioOutputControl />
              <VideoInputControl />
              <ContentShareControl />
            </ControlBar>
          </ControlBarWrapper>
        </>
      )}
    </Container>
  )
}

export default LearnerLiveSessionPlayer
