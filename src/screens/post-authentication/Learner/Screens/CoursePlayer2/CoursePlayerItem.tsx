import { Common, Learner, Store, User } from '@adewaskar/lms-common'
import { Fragment, useMemo } from 'react'

import CoursePlayerTextItem from './CoursePlayerItems/Text'
import ErrorBoundary from '@Components/ErrorBoundary'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import PDFViewer from '@Components/PDFViewer'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'
import { useParams } from 'react-router'

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
  const { id: courseId, itemId } = useParams()
  const { data: item } = Learner.Queries.useGetCourseItemDetails(
    courseId + '',
    itemId + ''
  )
  const {
    data: { metadata: { notes } }
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: 'course',
      id: courseId + ''
    },
    {
      enabled: !!courseId
    }
  )

  const { data: course } = Learner.Queries.useGetCourseDetails(courseId + '')
  const { data: file } = Learner.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  const currentItemNotes = notes.filter(note => note.item === item._id) || []
  let Component
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }
  const fileId = file.encoded || file._id

  if (item.type === 'video') {
    Component = (
      <MediaPlayer
        hls
        notes={currentItemNotes}
        watermark={course.advanced.watermark?.enabled ? WATERMERK : null}
        fileId={fileId}
        thumbnail={item.metadata?.thumbnail}
        height={550}
      />
    )
  }

  if (item.type === 'pdf') {
    Component = <PDFViewer file={file} />
  }
  return (
    // @ts-ignore
    <ErrorBoundary fallbackComponent={Component}>
      <Fragment>{Component}</Fragment>
    </ErrorBoundary>
  )
}

export default CoursePlayerItem
