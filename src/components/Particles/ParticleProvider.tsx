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
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        backgroundImage: 'url(/images/bg1.png)',
        backgroundRepeat: 'repeat',
        // opacity: 0.3,
        minHeight: '100vh'
      }}
    >
      {' '}
      <ParticlesContext.Provider value={value}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          // @ts-ignore
          options={particlesConfig}
          // options={EXAMPLECONFIG}
        />
        {children}
      </ParticlesContext.Provider>
    </div>
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
