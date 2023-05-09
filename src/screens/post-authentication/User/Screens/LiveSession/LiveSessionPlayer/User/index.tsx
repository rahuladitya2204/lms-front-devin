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
import UserLiveSessionPlayer from './LiveSessionPlayer'
import { Outlet, useParams } from 'react-router'
import { User } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { Spin, Typography } from 'antd'
import { AppStateProvider } from './Player/providers/AppStateProvider'
import { NavigationProvider } from './Player/Navigation/NavigationProvider'
import Header from '@Components/Header'
import dayjs from 'dayjs'

const { Text } = Typography

const UserLiveSessionPlayerEnter = () => {
  const { sessionId } = useParams()
  const logger = new ConsoleLogger('SDK', LogLevel.INFO)
  // const deviceController = new DefaultDeviceController(logger)
  // const meetingManager = new MeetingManager({
  //   logger: logger,
  //   deviceController: deviceController
  // })

  const meetingConfig = {
    logLevel: LogLevel.INFO,
    simulcastEnabled: true
  }
  // const { mutate: startSession } = User.Queries.useStartLiveSession()

  const { data: session } = User.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )

  // useEffect(
  //   () => {
  //     if (sessionId) {
  //       startSession({ session: sessionId })
  //     }
  //   },
  //   [sessionId]
  // )

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
              {/* <Header
                extra={[
                  <Text strong>
                    {' '}
                    {dayjs(session.scheduledAt).format('LLLL')}
                  </Text>
                ]}
                title={session.title}
              > */}
              <Outlet />
              {/* </Header> */}
            </RosterProvider>
          </NavigationProvider>
        </MeetingProvider>
      </ThemeProvider>
    </AppStateProvider>
  )
}

export default UserLiveSessionPlayerEnter
