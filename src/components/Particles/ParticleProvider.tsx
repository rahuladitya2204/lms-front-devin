import React, { createContext } from 'react'

import Particles from 'react-particles'
import useParticlesEffect from './useParticleEffect'

export const ParticlesContext = createContext({})

interface ParticlesProviderPropsI {
  children: React.ReactNode;
}

export const ParticlesProvider = ({ children }: ParticlesProviderPropsI) => {
  const {
    particlesConfig,
    value,
    particlesInit,
    particlesLoaded
  } = useParticlesEffect()
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
