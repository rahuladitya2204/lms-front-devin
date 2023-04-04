import './App.less'

import { ConfigProvider, theme } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Fragment } from 'react'

import AppRouter from './screens/AppRouter'
import { Global } from '@emotion/react'
import { Learner } from '@adewaskar/lms-common'
import useMessage from 'antd/es/message/useMessage'

const { defaultAlgorithm, darkAlgorithm } = theme

const queryClient = new QueryClient()

function App () {
  const [message, context] = useMessage()
  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <Global
          styles={{
            body: {
              margin: 0,
              padding: 0
            }
          }}
        />

        <AppRouter />
      </QueryClientProvider>
    </Fragment>
  )
}

export default App
