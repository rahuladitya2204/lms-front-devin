import 'react-quill/dist/quill.snow.css'

import ReactPlayer from 'react-player'

interface MediaPlayerPropsI {
  url: string;
}

function MediaPlayer(props: MediaPlayerPropsI) {
  return <ReactPlayer height='500px' width='100%' url={props.url} />
  // return <ReactPlayer width='100%' url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />;
}

export default MediaPlayer
