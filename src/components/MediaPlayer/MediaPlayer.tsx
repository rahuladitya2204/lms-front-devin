import { Common, Store, Types } from '@adewaskar/lms-common'

import PlayrComponent from './Playr/Playr'
import VideoJs from './Videojs/Videojs'
import { useEffect } from 'react'

interface MediaPlayerPropsI {
  file?: Types.FileType;
  fileId?: string;
  url?: string;
  watermark?: string | null;
  hls?: boolean;
  width?: number;
  height?: number;
  notes?: Types.CourseNote[];
  onEnded?: () => void;
}

export const MediaPlayer = (props: MediaPlayerPropsI) => {
  const resetPlayer: any = Store.usePlayer(s => s.resetPlayerState)
  const enabled = !!(!props.url && props.fileId)
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(
    props.fileId + '',
    {
      enabled
    }
  )
  const Url = props.url || url

  useEffect(() => {
    return () => {
      console.log('resetting player')
      resetPlayer()
    }
  }, [props.url])
  // return <VideoJs url={Url} />
  return (
    <div
      style={{
        height: props.height || 300,
        width: props.width || '100%',
        position: 'relative'
      }}
    >
      {Url ? <PlayrComponent notes={props.notes} url={Url} /> : null}
      {/* <VideoJsPlayer watermark={props.watermark} hls={props.hls}
        url={Url}
      /> */}
    </div>
  )
}

export default MediaPlayer
