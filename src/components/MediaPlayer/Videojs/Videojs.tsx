// @ts-nocheck
import 'video.js/dist/video-js.css'

import React, { useEffect, useRef } from 'react'

import { CustomXhrLoader } from '../Playr/Hls'
import Hls from 'hls.js'
import videojs from 'video.js'

const VideoPlayer = ({ url, hls, watermark }) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

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
          [{
            
          }],
          () => {
            videojs.log('player is ready')
            player.on('timeupdate', () => {
              onTimeUpdate(player)
            })
            setPlayer({
              playerInstance: player
            })
            onReady && onReady(player)
          }
        ))

        if (props.watermark) {
          player.dynamicWatermark({
            elementId: 'unique_id',
            watermarkText: props.watermark.toString(),
            changeDuration: 8000,
            cssText: `display: inline-block; color: red; background-color: transparent; font-size: 1rem; z-index: 9999; position: absolute; @media only screen and (max-width: 992px){font-size: 0.8rem;}
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10 and IE 11 */
            user-select: none; /* Standard syntax */
            `
          })
        }

        if (props.notes) {
          const markers = props.notes.map(note => {
            return {
              time: note.time,
              text: 'Note'
            }
          })
          initMarkers(player, markers)
        }

        // You could update an existing player in the `else` block here
        // on prop change, for example:
      } else {
        const player = playerRef.current
        // player.src(options.sources)
      }
    },
    [videoRef, url]
  )

  useEffect(
    () => {
      if (playerRef.current) {
        if (hls && Hls.isSupported()) {
          const hlsInstance = new Hls({
            loader: CustomXhrLoader
          })
          hlsInstance.loadSource(url)
          hlsInstance.attachMedia(videoRef.current)
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            playerRef.current.play()
          })
        } else {
          playerRef.current.src(url)
          playerRef.current.load()
        }
      }
    },
    [url, hls]
  )

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        width="640"
        height="360"
      />{' '}
    </div>
  )
}

export default VideoPlayer
