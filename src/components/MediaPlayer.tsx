import 'react-quill/dist/quill.snow.css'

import { Player } from 'video-react'

interface MediaPlayerPropsI {
  url: string;
  width?: number;
  height?: number;
}

function MediaPlayer(props: MediaPlayerPropsI) {
  return (
    <Player height={props.height} width={props.width}>
      <source src={props.url} />
    </Player>
  )
  // return <ReactPlayer width='100%' url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />;
}

export default MediaPlayer
