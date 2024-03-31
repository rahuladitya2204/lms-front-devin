import { Common, Store, Types } from '@adewaskar/lms-common'
import dynamic from 'next/dynamic';

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

// PlyrComponent uses plyr library which in-turn uses document object without a useEffect and hence errors out on SSR
// To resolve the issue, this component is wrapped with next dynamic to not render this during SSR at all
const PlayrComponent = dynamic(() => import('./Playr/Playr'), {
  ssr: false,
  // TODO: add a skeleton here for the PlyrComponent
  loading: () => <div>Loading...</div>,
});


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
