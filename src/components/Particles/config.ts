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

export const coins = {
  fullScreen: {
    enable: true,
    zIndex: 0
  },
  background: {
    color: 'transparent'
  },
  particles: {
    number: {
      value: 50, // Adjust the number of coins
      density: {
        enable: true,
        area: 800 // Density area
      }
    },
    shape: {
      type: 'image', // Define particle shape as an image
      image: {
        src: 'path_to_coin_image.png', // Path to the coin image
        width: 20, // Width of the coin image
        height: 20 // Height of the coin image
      }
    },
    move: {
      direction: 'bottom', // Coins fall downwards
      outMode: 'bounce', // Coins bounce on the bottom edge
      gravity: {
        enable: true,
        acceleration: 9.81 // Gravity acceleration in m/s²
      },
      speed: 3 // Adjust the speed if necessary
    },
    size: {
      value: { min: 5, max: 10 }, // Size range of the coins
      animation: {
        enable: true,
        speed: 20,
        minimumValue: 5
      }
    },
    bounce: {
      horizontal: {
        random: {
          enable: true,
          minimumValue: 0.5
        }
      },
      vertical: {
        random: {
          enable: true,
          minimumValue: 0.8
        }
      }
    }
  },
  emitters: {
    direction: 'top-right', // Emit from top-right
    life: {
      count: 0, // Continuous emission
      duration: 0.1, // Short duration for each emission
      delay: 0.4
    },
    rate: {
      quantity: 5, // Adjust quantity emitted per unit time
      delay: 0.1
    },
    size: {
      width: 10, // Small width for top-right corner emission
      height: 10
    },
    position: {
      x: 100, // Emit from the top-right corner (percentage)
      y: 0
    }
  }
}
export const presetConfigs = {
  confetti,
  fireworks,
  coins
}

export enum ParticlePresetEnum{
  FIREWORKS = 'fireworks',
  CONFETTI = 'confetti',
  COINS='coins'
}