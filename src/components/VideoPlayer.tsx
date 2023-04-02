// @ts-nocheck
import React, { useEffect } from 'react'

import LoadVideo from '@Utils/load-video'
import { Types } from '@adewaskar/lms-common'

interface VideoPlayerProps {
  item: Types.CourseSectionItem;
}

function VideoPlayer(props: VideoPlayerProps) {
  useEffect(
    () => {
      // LoadVideo()
      function handlePlayerReady(event) {
        const video = event.video
        const player = event.player

        // Below are some common methods that you can use

        // Mute video
        player.muted(true)

        // Play video
        player.play()

        // Pause video
        player.pause()

        // Unmute video
        player.muted(false)

        // a decimal number between 0 (muted) and 1.0 (full volume)
        // Set volume to 90%
        player.volume(0.9)

        // Set volume to 30%
        player.volume(0.3)
        // Forward 10 seconds
        player.currentTime(player.currentTime() + 10)

        // Backward 10 seconds
        player.currentTime(player.currentTime() - 10)

        // set video playback rate to 1x
        player.playbackRate(1)

        // set video playback rate to 2x
        player.playbackRate(2)
      }

      window.addEventListener('dyntubePlayerReady', handlePlayerReady)

      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('dyntubePlayerReady', handlePlayerReady)
      }
    },
    [props.item]
  )
  return <div data-dyntube-key={props.item.metadata?.key} />
}

export default VideoPlayer
