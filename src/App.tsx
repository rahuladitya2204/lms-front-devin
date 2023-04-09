import './App.less'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Fragment } from 'react'

import AppRouter from './screens/AppRouter'
import { Global } from '@emotion/react'
import { theme } from 'antd'

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

        <AppRouter />
      </QueryClientProvider>
    </Fragment>
  )
}

export default App
