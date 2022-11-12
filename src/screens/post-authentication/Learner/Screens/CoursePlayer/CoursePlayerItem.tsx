import MediaPlayer from '@Components/MediaPlayer'
import { Fragment } from 'react'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'
import CoursePlayerTextItem from './CoursePlayerItems/Text'

function CoursePlayerItem () {
  let Component
  const item = useGetNodeFromRouterOutlet()
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }

  if (item.type === 'video') {
    Component = <MediaPlayer url={item?.metadata?.url + ''} />
  }
  return <Fragment>{Component}</Fragment>
  // return null;
}

export default CoursePlayerItem
