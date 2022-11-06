import 'react-quill/dist/quill.snow.css'

import ReactPlayer from 'react-player'

interface MediaPlayerPropsI {
  url: string;
  width?: string;
  height?: string;
}

function MediaPlayer(props: MediaPlayerPropsI) {
  return (
    <ReactPlayer
      height={props.height || '500px'}
      width={props.width || '100%'}
      url={props.url}
    />
  )
  // return <ReactPlayer width='100%' url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />;
}

export default MediaPlayer
