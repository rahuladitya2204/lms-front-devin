import './App.less'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Fragment, useEffect, useMemo } from 'react'
import { Store, Utils } from '@adewaskar/lms-common'

import AppRouter from './screens/AppRouter'
import ErrorBoundary from '@Components/ErrorBoundary'
import { Global } from '@emotion/react'
import { theme } from 'antd'

const { defaultAlgorithm, darkAlgorithm } = theme

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true,
      staleTime: Infinity
    }
  }
})

function App () {
  let subdomain = useMemo(
    () => {
      const hostname = window.location.hostname
      const parts = hostname.split('.')
      const subdomain = parts.length > 2 ? parts[0] : null
      return subdomain
    },
    [window.location.hostname]
  )
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

        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </QueryClientProvider>
    </Fragment>
  )
}

export default App
