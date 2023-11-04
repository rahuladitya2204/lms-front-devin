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
  const [breakpoint, setBreakpoint] = useState(() =>
    getDeviceConfig(window.innerWidth)
  )

  useEffect(() => {
    const calcInnerWidth = () => {
      setBreakpoint(getDeviceConfig(window.innerWidth))
    }
    window.addEventListener('resize', calcInnerWidth)
    return () => window.removeEventListener('resize', calcInnerWidth)
  }, [])

  return {
    isMobile: breakpoint === 'isMobile',
    isTablet: breakpoint === 'isTablet',
    isDesktop: breakpoint === 'isDesktop'
  }
}

export default useBreakpoint
