import {
  ConsoleLogger,
  DefaultDeviceController,
  LogLevel
} from 'amazon-chime-sdk-js'
import {
  GlobalStyles,
  MeetingProvider,
  RosterProvider,
  lightTheme
} from 'amazon-chime-sdk-component-library-react'
import { Outlet } from 'react-router'
import { useParams } from '@Router/index'
import { Spin, Typography } from 'antd'

import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import { ThemeProvider } from 'styled-components'

const { Text } = Typography

const UserEventPlayerEnter = () => {
  const { eventId } = useParams()
  // const logger = new ConsoleLogger('SDK', LogLevel.INFO)

  const meetingConfig = {
    logLevel: LogLevel.INFO,
    simulcastEnabled: true
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      {/* @ts-ignore */}
      <MeetingProvider {...meetingConfig}>
        <NavigationProvider>
          {/* @ts-ignore */}
          <RosterProvider>
            <Outlet />
          </RosterProvider>
        </NavigationProvider>
      </MeetingProvider>
    </ThemeProvider>
  )
}

export default UserEventPlayerEnter
