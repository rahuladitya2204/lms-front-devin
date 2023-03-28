import 'react-quill/dist/quill.snow.css'

import ReactPlayer from 'react-player'

interface MediaPlayerPropsI {
  url: string;
  width?: number;
  height?: number;
  onEnded?: () => void;
}

function MediaPlayer(props: MediaPlayerPropsI) {
  return (
    <ReactPlayer
      onEnded={props.onEnded}
      controls
      playing={false}
      height="500px"
      width="100%"
      url={props.url}
    />
  )
}

export default MediaPlayer
