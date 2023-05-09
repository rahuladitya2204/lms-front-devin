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
import { Outlet, useParams } from 'react-router'
import { Spin, Typography } from 'antd'

import { AppStateProvider } from './Player/providers/AppStateProvider'
import Header from '@Components/Header'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import { ThemeProvider } from 'styled-components'
import { User } from '@adewaskar/lms-common'
import UserLiveSessionPlayer from './LiveSessionPlayer'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useLiveSession } from './hooks'

const { Text } = Typography

const UserLiveSessionPlayerEnter = () => {
  const { sessionId } = useParams()
  // const logger = new ConsoleLogger('SDK', LogLevel.INFO)

  const meetingConfig = {
    logLevel: LogLevel.INFO,
    simulcastEnabled: true
  }

  return (
    <AppStateProvider>
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
    </AppStateProvider>
  )
}

export default UserLiveSessionPlayerEnter
