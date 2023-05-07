import './style.css'
import {
  VideoTileGrid,
  UserActivityProvider
} from 'amazon-chime-sdk-component-library-react'
import { StyledContent, StyledLayout } from './styled'
import MeetingControls from './MeetingControls'

const LiveSessionPlayer = () => {
  // ... rest of the code

  return (
    // @ts-ignore
    <UserActivityProvider>
      <StyledLayout showNav showRoster>
        <StyledContent>
          {/* <MeetingMetrics /> */}
          <VideoTileGrid
            className="videos"
            // noRemoteVideoView={<MeetingDetails />}
          />
          <MeetingControls />
        </StyledContent>
        {/* <NavigationControl /> */}
      </StyledLayout>
    </UserActivityProvider>
  )
}

export default LiveSessionPlayer
