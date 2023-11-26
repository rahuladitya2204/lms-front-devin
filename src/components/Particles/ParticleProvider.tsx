import React, { createContext, useCallback, useState } from 'react'

import Particles from 'react-particles'
import { loadConfettiPreset } from 'tsparticles-preset-confetti'
import { loadFireworksPreset } from 'tsparticles-preset-fireworks'
import { loadSlim } from 'tsparticles-slim'
import { presetConfigs } from './config'
import { tsParticles } from 'tsparticles-engine'

export const ParticlesContext = createContext({})

interface ParticlesProviderPropsI {
  children: React.ReactNode;
}

export const ParticlesProvider = ({ children }: ParticlesProviderPropsI) => {
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
  console.log(particlesConfig, preset, 'particlesConfig')
  return (
    <ParticlesContext.Provider value={value}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          // @ts-ignore
          options={particlesConfig}
        />
      </div>
      {children}
    </ParticlesContext.Provider>
  )
}
