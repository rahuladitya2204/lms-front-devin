export const confetti = {
  // Other configuration...
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800
      }
    },
    move: {
      direction: 'bottom',
      outMode: 'out',
      speed: 4
    }
  },
  emitters: {
    direction: 'none',
    life: {
      count: 1, // Emit only once
      duration: 5, // Duration of 5 seconds
      delay: 0.4 // Delay before starting
    },
    rate: {
      quantity: 10,
      delay: 0.1
    },
    size: {
      width: 100, // Adjust the width to control the spread
      height: 0 // Small height to make it emit from a line
    },
    position: {
      x: 50, // Center of the screen (percentage)
      y: 0 // Top of the screen
    }
  }
  // ... rest of your configuration
}

export const fireworks = {
  fullScreen: {
    enable: true,
    zIndex: 0
  },
  background: {
    color: 'transparent' // Ensuring the background is transparent
  },
  preset: 'fireworks' // Using the fireworks preset
  // Additional configurations specific to fireworks can be added here
}

export const presetConfigs = {
  confetti,
  fireworks
}

export enum ParticlePresetEnum{
  FIREWORKS = 'fireworks',
  CONFETTI='confetti'
}