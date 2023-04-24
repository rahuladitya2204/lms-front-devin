import { Common, Learner, Store } from '@adewaskar/lms-common'
import { Fragment, useMemo } from 'react'

import CoursePlayerTextItem from './CoursePlayerItems/Text'
import MediaPlayer from '@Components/MediaPlayer'
import PDFViewer from '@Components/PDFViewer'
import VideoPlayer from '@Components/VideoPlayer'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'

function CoursePlayerItem() {
  const user = Store.useAuthentication(s => s.user)
  const WATERMERK = useMemo(
    () => {
      return ` <div>
  <p>${user.name}</p>
  <p>${user.contactNo}</p>
</div>`
    },
    [user]
  )
  const { node: item, courseId } = useGetNodeFromRouterOutlet()
  const { data: { course } } = Learner.Queries.useGetEnrolledCourseDetails(
    courseId + ''
  )
  const { data: file } = Common.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  let Component
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }

  if (item.type === 'video') {
    Component = (
      <MediaPlayer
        watermark={course.advanced.watermark?.enabled ? WATERMERK : null}
        fileId={file._id}
      />
    )
  }

  if (item.type === 'pdf') {
    Component = <PDFViewer file={file} />
  }
  return <Fragment>{Component}</Fragment>
  // return null;
}

export default CoursePlayerItem
