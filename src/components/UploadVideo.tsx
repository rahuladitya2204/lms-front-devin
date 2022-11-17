import { useState } from 'react'
import { getMetadata } from 'video-metadata-thumbnails'
import MediaPlayer from './MediaPlayer'
import MediaUpload from './MediaUpload'

export default function UploadVideo(props: { url: string }) {
  const [url, setUrl] = useState(props.url)
  const [metadata, setMetadata] = useState({
    duration: {
      value: 0,
      unit: ''
    }
  })
  return (
    <MediaUpload
      width="300px"
      onUpload={({ url }) => {
        setUrl(url)
      }}
      height="250px"
      renderItem={() => <MediaPlayer url={url} />}
      url={url}
    >
      <MediaPlayer url={url} />
    </MediaUpload>
  )
}
