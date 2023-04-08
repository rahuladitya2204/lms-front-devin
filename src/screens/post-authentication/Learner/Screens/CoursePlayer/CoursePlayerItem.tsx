import CoursePlayerTextItem from './CoursePlayerItems/Text'
import { Fragment } from 'react'
import { Learner } from '@adewaskar/lms-common'
import MediaPlayer from '@Components/MediaPlayer'
import PDFViewer from '@Components/PDFViewer'
import VideoPlayer from '@Components/VideoPlayer'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'

function CoursePlayerItem() {
  const item = useGetNodeFromRouterOutlet()
  const { data: url } = Learner.Queries.useGetPresignedUrl(
    item?.metadata?.key + ''
  )
  console.log(url, 'url')
  let Component
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }

  if (item.type === 'video') {
    Component = <MediaPlayer url={url + ''} />
  }

  if (item.type === 'pdf') {
    Component = <PDFViewer url={url + ''} />
  }
  return <Fragment>{Component}</Fragment>
  // return null;
}

export default CoursePlayerItem
