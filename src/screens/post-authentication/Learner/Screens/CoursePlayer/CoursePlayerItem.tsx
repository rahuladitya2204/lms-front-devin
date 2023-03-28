import CoursePlayerTextItem from './CoursePlayerItems/Text'
import { Fragment } from 'react'
import MediaPlayer from '@Components/MediaPlayer'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'

function CoursePlayerItem() {
  let Component
  const item = useGetNodeFromRouterOutlet()
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }

  if (item.type === 'video') {
    Component = <MediaPlayer height={600} url={item?.metadata?.url + ''} />
  }
  return <Fragment>{Component}</Fragment>
  // return null;
}

export default CoursePlayerItem
