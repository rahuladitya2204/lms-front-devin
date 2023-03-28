import './App.less'

import { ConfigProvider, theme } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Fragment } from 'react'

import AppRouter from './screens/AppRouter'
import { Global } from '@emotion/react'

const { defaultAlgorithm, darkAlgorithm } = theme

const queryClient = new QueryClient()

function App () {
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
        <ConfigProvider
          theme={{
            // algorithm: darkAlgorithm,
            token: {
              // colorPrimary: '#00b96b'
            }
          }}
          csp={{ nonce: 'YourNonceCode' }}
        >
          <AppRouter />
        </ConfigProvider>
      </QueryClientProvider>
    </Fragment>
  )
}

export default App
