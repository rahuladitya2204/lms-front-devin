import { useEffect, useState } from 'react'

const getDeviceConfig = (width: number) => {
  if (width < 768) {
    return 'isMobile'
  } else if (width >= 768 && width < 992) {
    return 'isTablet'
  } else {
    return 'isDesktop'
  }
}

const useBreakpoint = () => {
  const [width, setWidth] = useState(0)
  const [breakpoint, setBreakpoint] = useState(() =>
    getDeviceConfig(window.innerWidth)
  )
  const calcInnerWidth = () => {
    setWidth(window.innerWidth)
    setBreakpoint(getDeviceConfig(window.innerWidth))
  }
  useEffect(() => {
    calcInnerWidth()

    window.addEventListener('resize', calcInnerWidth)
    return () => window.removeEventListener('resize', calcInnerWidth)
  }, [])
  // console.log()
  return {
    isMobile: breakpoint === 'isMobile',
    isTablet: breakpoint === 'isTablet',
    isDesktop: breakpoint === 'isDesktop',
    width
  }
}

export default useBreakpoint
