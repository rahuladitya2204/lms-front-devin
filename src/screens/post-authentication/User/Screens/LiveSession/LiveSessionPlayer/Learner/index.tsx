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

import { ThemeProvider } from 'styled-components'
import { Outlet, useParams } from 'react-router'
import { Learner } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { Spin } from 'antd'
import { AppStateProvider } from './Player/providers/AppStateProvider'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import Header from '@Components/Header'

const LearnerLiveSessionPlayerEnter = () => {
  const { sessionId } = useParams()
  const logger = new ConsoleLogger('SDK', LogLevel.INFO)
  const deviceController = new DefaultDeviceController(logger)
  const meetingConfig = {
    logLevel: LogLevel.INFO,
    simulcastEnabled: true
  }
  const { data: session } = Learner.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )

  console.log(session, 'tukur')
  return (
    <AppStateProvider>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyles />
        {/* @ts-ignore */}
        <MeetingProvider
          {...meetingConfig}
          // // configuration={{}}
          // manager={meetingManager}
          // eventReporter={null}
        >
          <NavigationProvider>
            {/* @ts-ignore */}
            <RosterProvider>
              <Header title={session.title}>
                <Outlet />
              </Header>
            </RosterProvider>
          </NavigationProvider>
        </MeetingProvider>
      </ThemeProvider>
    </AppStateProvider>
  )
}

export default LearnerLiveSessionPlayerEnter
