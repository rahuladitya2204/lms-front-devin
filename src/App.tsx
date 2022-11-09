import './App.less'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import React, { Fragment } from 'react'

import { Global } from '@emotion/react'
import AppRouter from './screens/AppRouter'

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
