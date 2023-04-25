import { Common, Types } from '@adewaskar/lms-common'

import PlayrComponent from './Playr/Playr'
import VideoJs from './Videojs/Videojs'

interface MediaPlayerPropsI {
  file?: Types.FileType;
  fileId?: string;
  url?: string;
  watermark?: string | null;
  width?: number;
  height?: number;
  notes?: Types.CourseNote[];
  onEnded?: () => void;
}

export const MediaPlayer = (props: MediaPlayerPropsI) => {
  const enabled = !!(!props.url && props.fileId)
  const { data: url } = Common.Queries.useGetPresignedUrl(props.fileId + '', {
    enabled
  })
  const Url = props.url || url

  // return <VideoJs url={Url} />
  return <PlayrComponent notes={props.notes} url={Url} />
}

export default MediaPlayer
