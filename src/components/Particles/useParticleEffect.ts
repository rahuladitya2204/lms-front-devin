import { useCallback, useState } from 'react'

import { loadConfettiPreset } from 'tsparticles-preset-confetti'
import { loadFireworksPreset } from 'tsparticles-preset-fireworks'
import { loadSlim } from 'tsparticles-slim'
import { presetConfigs } from './config'

const DEFAULT_DURATION = 10 // 5secs
const useParticlesEffect = () => {
  const [preset, setPreset] = useState('')
  const particlesInit = useCallback(async (engine: any) => {
    console.log(engine)
    await loadSlim(engine)
    await loadConfettiPreset(engine) // Load the confetti preset
    await loadFireworksPreset(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: any) => {
    console.log(container)
  }, [])

  const initiateEffect = (effect = 'confetti') => {
    setPreset(effect)
    setTimeout(() => {
      setPreset('')
    }, DEFAULT_DURATION * 1000)
  }
  const particlesConfig = {
    preset: preset,
    // @ts-ignore
    ...(presetConfigs[preset] || {})
  }

  const value = {
    particlesInit,
    particlesLoaded,
    initiateEffect
  }
  return { particlesInit, particlesLoaded, particlesConfig, value }
}

export default useParticlesEffect
