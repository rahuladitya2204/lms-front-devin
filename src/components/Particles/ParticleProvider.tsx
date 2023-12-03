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
          // options={EXAMPLECONFIG}
        />
      </div>
      {children}
    </ParticlesContext.Provider>
  )
}

const EXAMPLECONFIG = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: ['#ffd700', '#00fde0', '#ffff00']
    },
    shape: {
      type: ['circle', 'triangle', 'star'],
      stroke: {
        width: 0
      }
    },
    opacity: {
      value: 0.6,
      random: false
    },
    size: {
      value: 3,
      random: true
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffeb3b',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'push'
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        }
      }
    }
  },
  retina_detect: true
}
