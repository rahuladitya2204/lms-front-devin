import './App.css'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import React, { Fragment } from 'react'

import AppContainer from './screens/RouteContainer'
import { Global } from '@emotion/react'

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
        <AppContainer />
      </QueryClientProvider>
    </Fragment>
  )
}

export default App
