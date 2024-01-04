// @ts-ignore
import { OpenCvProvider } from 'opencv-react'
import { Outlet } from 'react-router'
import { useAppInit } from '@Hooks/CommonHooks'

export default function RootScreen () {
  const { isInitDone } = useAppInit()
  const showLoadingScreen = !isInitDone
  return (
    <OpenCvProvider
      // @ts-ignore
      onLoad={cv => (window.cv = cv)}
      openCvPath="https://docs.opencv.org/4.5.0/opencv.js"
    >
      <Outlet context={{ showLoadingScreen }} />{' '}
    </OpenCvProvider>
  )
}
