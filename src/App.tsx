import './App.css'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import React, { Fragment } from 'react'

import { Global } from '@emotion/react'
import RouteContainer from './screens/AppRouter'

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
        <RouteContainer />
      </QueryClientProvider>
    </Fragment>
  )
}

export default App
