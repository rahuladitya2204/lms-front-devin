// Import Plyr styles
import './plyr.css'
import './style.css'

import { Store, Types } from '@adewaskar/lms-common'
import { useEffect, useRef } from 'react'

import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import Plyr from 'plyr-react'
import { htmlToText } from 'html-to-text'

interface VideoJsComponentPropsI {
  url?: string;
  watermark?: string | null;
  width?: number;
  height?: number;
  notes?: Types.CourseNote[];
  onEnded?: () => void;
}

export const PlayrComponent = (props: VideoJsComponentPropsI) => {
  const setPlayer = Store.usePlayer(s => s.setPlayerState)
  const playerRef = useRef(null)
  console.log(playerRef, 'playerRef')
  const points =
    props?.notes?.map(note => {
      return {
        label: htmlToText(note.content),
        time: note.time
      }
    }) || []
  useEffect(
    () => {
      console.log(playerRef?.current, 'playerRef.current')
      // @ts-ignore
      if (playerRef.current && playerRef.current.plyr) {
        // @ts-ignore

        setPlayer({ playerInstance: playerRef.current.plyr })
        // @ts-ignore
        // playerRef?.current?.plyr?.on('timeupdate', console.log)
      }
      return () => {
        // @ts-ignore
        console.log('Destroying', playerRef?.current?.plyr)
      }
    },
    [playerRef.current]
  )
  console.log(points, 'points')
  const PlayerComponent = (
    <Plyr
      onTimeUpdate={e => console.log(e, 'eee')}
      ref={playerRef}
      options={{
        markers: {
          enabled: true,
          points: points
        }
      }}
      source={{
        type: 'video',
        // @ts-ignore
        sources: [{ src: props.url }]
      }}
    />
  )
  return (
    <ErrorBoundary message={PlayerComponent}>{PlayerComponent}</ErrorBoundary>
  )
}

export default PlayrComponent
