import { loadSlim } from 'tsparticles-slim'
// hooks/useParticlesEffect.js
import { useCallback } from 'react'

const useParticlesEffect = () => {
  const particlesInit = useCallback(async (engine: any) => {
    console.log(engine)
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: any) => {
    console.log(container)
  }, [])

  const particlesConfig = {
    fullScreen: {
      enable: true,
      zIndex: 0
    },
    particles: {
      number: {
        value: 5,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#000000'
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false
        }
      },
      size: {
        value: 10,
        random: true,
        anim: {
          enable: false
        }
      },
      move: {
        enable: true,
        speed: 10,
        direction: 'none',
        random: false,
        straight: false,
        // out_mode: 'explode',
        attract: {
          enable: false
        }
      },
      line_linked: {
        enable: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: false
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  }

  return { particlesInit, particlesLoaded, particlesConfig }
}

export default useParticlesEffect
