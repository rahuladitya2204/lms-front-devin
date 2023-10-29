import { Common, Learner, Store } from '@adewaskar/lms-common'
import { Fragment, useMemo } from 'react'

import CoursePlayerQuiz from './CoursePlayerItems/CourseQuizItem/QuizItem'
import CoursePlayerTextItem from './CoursePlayerItems/Text'
import ErrorBoundary from '@Components/ErrorBoundary'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import PDFViewer from '@Components/PDFViewer'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'

function CoursePlayerItem() {
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress()
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
  const { node: item, courseId, sectionId } = useGetNodeFromRouterOutlet()

  const onEnd = () => {
    updateProgress({
      courseId: courseId + '',
      sectionId: sectionId + '',
      action: 'ADD',
      itemId: item._id,
      data: null
    })
  }

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
  console.log(item, 'itmi')
  const { data: course } = Learner.Queries.useGetCourseDetails(courseId + '')
  const { data: file } = Learner.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  const currentItemNotes = notes.filter(note => note.item === item._id) || []
  let Component
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }

  if (item.type === 'quiz') {
    Component = <CoursePlayerQuiz onEnd={onEnd} item={item} />
  }
  const fileId = file.encoded || file._id

  if (item.type === 'video') {
    Component = !item.external?.url ? (
      <MediaPlayer
        hls
        thumbnail={item.metadata?.thumbnail}
        notes={currentItemNotes}
        watermark={course.advanced.watermark?.enabled ? WATERMERK : null}
        fileId={fileId}
        height={550}
      />
    ) : (
      <MediaPlayer
        hls
        thumbnail={item.metadata?.thumbnail}
        notes={currentItemNotes}
        watermark={course.advanced.watermark?.enabled ? WATERMERK : null}
        platform={item.external?.platform}
        url={item.external?.url}
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
