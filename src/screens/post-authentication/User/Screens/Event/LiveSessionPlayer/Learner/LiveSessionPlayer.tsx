import './style.css'
import {
  VideoTileGrid,
  UserActivityProvider
} from 'amazon-chime-sdk-component-library-react'
import { StyledContent, StyledLayout } from './Player/styled'
import MeetingControls from './Player/MeetingControls'
import NavigationControl from './Player/Navigation/NavigationControl'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'

const EventPlayer = () => {
  // ... rest of the code

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
            <MeetingControls />
          </StyledContent>
          <NavigationControl />
        </StyledLayout>
      </UserActivityProvider>
    </NavigationProvider>
  )
}

export default EventPlayer
