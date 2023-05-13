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

import { Learner } from '@adewaskar/lms-common'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import { ThemeProvider } from 'styled-components'

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
            <Outlet />
          </RosterProvider>
        </NavigationProvider>
      </MeetingProvider>
    </ThemeProvider>
  )
}

export default LearnerLiveSessionPlayerEnter
