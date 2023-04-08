// @ts-nocheck
import 'video.js/dist/video-js.css'

import React from 'react'
import videojs from 'video.js'
import watermark from 'videojs-dynamic-watermark'

videojs.registerPlugin('dynamicWatermark', watermark)

interface MediaPlayerPropsI {
  url?: string;
  watermark?: string;
  width?: number;
  height?: number;
  onEnded?: () => void;
}

export const MediaPlayer = (props: MediaPlayerPropsI) => {
  const videoRef = React.useRef(null)
  const playerRef = React.useRef(null)
  const options = {
    aspectRatio: '16:9',
    // autoplay: true,
    controls: true,
    // responsive: true,
    fluid: true,
    sources: [
      {
        // props.url
        src: props.url,
        type: 'video/mp4'
      }
    ]
  }
  const { onReady } = props

  React.useEffect(
    () => {
      // Make sure Video.js player is only initialized once
      if (!playerRef.current) {
        // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
        const videoElement = document.createElement('video-js')

        videoElement.classList.add('vjs-big-play-centered')
        videoRef.current.appendChild(videoElement)

        const player = (playerRef.current = videojs(
          videoElement,
          options,
          () => {
            videojs.log('player is ready')
            onReady && onReady(player)
          }
        ))
        if (props.watermark) {
          player.dynamicWatermark({
            elementId: 'unique_id',
            watermarkText: props.watermark.toString(),
            changeDuration: 8000,
            cssText:
            `display: inline-block; color: red; background-color: transparent; font-size: 1rem; z-index: 9999; position: absolute; @media only screen and (max-width: 992px){font-size: 0.8rem;}
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10 and IE 11 */
            user-select: none; /* Standard syntax */
            `
          })
        }

        // You could update an existing player in the `else` block here
        // on prop change, for example:
      } else {
        const player = playerRef.current
        player.src(options.sources)
      }
    },
    [options, videoRef]
  )

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(
    () => {
      const player = playerRef.current
      // player.autoplay(options.autoplay)
      console.log(player, 'papap')

      return () => {
        if (player && !player.isDisposed()) {
          player.dispose()
          playerRef.current = null
        }
      }
    },
    [playerRef]
  )

  return (
    <div
      data-vjs-player
      style={{
        // height: '500px',
        width: '100%'
      }}
    >
      <div ref={videoRef} />
    </div>
  )
}

export default MediaPlayer
