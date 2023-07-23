import { Common, Learner, Store } from '@adewaskar/lms-common'
import { Fragment, useMemo } from 'react'

import CoursePlayerTextItem from './CoursePlayerItems/Text'
import ErrorBoundary from '@Components/ErrorBoundary'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import PDFViewer from '@Components/PDFViewer'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'
import CoursePlayerQuiz from './CoursePlayerItems/CourseQuizItem/QuizItem'

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
  const {
    data: { course, notes }
  } = Learner.Queries.useGetEnrolledCourseDetails(courseId + '')
  const { data: file } = Learner.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  const currentItemNotes = notes.filter(note => note.item === item._id) || []
  let Component
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }

  if (item.type === 'quiz') {
    Component = <CoursePlayerQuiz item={item} />
  }

  if (item.type === 'video') {
    Component = (
      <MediaPlayer
        hls
        thumbnail={item.metadata?.thumbnail}
        notes={currentItemNotes}
        watermark={course.advanced.watermark?.enabled ? WATERMERK : null}
        fileId={file._id}
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
