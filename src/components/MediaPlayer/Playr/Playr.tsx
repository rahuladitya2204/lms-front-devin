// Import Plyr styles
import './plyr.css'

import { Store, Types } from '@adewaskar/lms-common'

import Plyr from 'plyr-react'

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
  const points =
    props?.notes?.map(note => {
      return {
        label: 'Note',
        time: note.time
      }
    }) || []
  console.log(points, 'points')
  return (
    <Plyr
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
}

export default PlayrComponent
