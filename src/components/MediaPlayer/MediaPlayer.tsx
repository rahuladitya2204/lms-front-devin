import { Common, Store, Types } from '@adewaskar/lms-common'

import PlayrComponent from './Playr/Playr'

import { useEffect } from 'react'

interface MediaPlayerPropsI {
  file?: Types.FileType;
  fileId?: string;
  url?: string;
  thumbnail?: string;
  watermark?: string | null;
  platform?: string;
  hls?: boolean;
  width?: number;
  height?: number;
  notes?: Types.CourseNote[];
  onEnded?: () => void;
  onLoadingStarted?: () => void;
  onLoadingEnded?: () => void;
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

  useEffect(
    () => {
      return () => {
        resetPlayer()
      }
    },
    [props.url]
  )
  // return <VideoJs url={Url} />
  return (
    <div
      style={{
        height: props.height || 300,
        width: props.width || '100%',
        position: 'relative'
      }}
    >
      {Url ? (
        <PlayrComponent
          platform={props.platform}
          thumbnail={props.thumbnail}
          notes={props.notes}
          url={Url}
          onLoadingStarted={props.onLoadingStarted}
          onLoadingEnded={props.onLoadingEnded}
        />
      ) : null}
    </div>
  )
}

export default MediaPlayer
