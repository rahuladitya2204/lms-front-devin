import { Common, Types } from '@adewaskar/lms-common'

import PlayrComponent from './Playr/Playr'
import VideoJs from './Videojs/Videojs'

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
  const enabled = !!(!props.url && props.fileId)
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(
    props.fileId + '',
    {
      enabled: !!props.fileId
    }
  )
  const Url = props.url || url
  console.log(Url, 'urll')
  // return <VideoJs url={Url} />
  return (
    <div style={{ minHeight: 400, position: 'relative' }}>
      <PlayrComponent hls={props.hls} notes={props.notes} url={Url} />
    </div>
  )
}

export default MediaPlayer
