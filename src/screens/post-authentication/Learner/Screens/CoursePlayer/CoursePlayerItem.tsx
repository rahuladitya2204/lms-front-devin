import { Common, Learner, Store } from '@adewaskar/lms-common'
import { Fragment, useMemo, useState } from 'react'

import CoursePlayerQuiz from './CoursePlayerItems/CourseQuizItem/QuizItem'
import CoursePlayerTextItem from './CoursePlayerItems/Text'
import ErrorBoundary from '@Components/ErrorBoundary'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import PDFViewer from '@Components/PDFViewer'
import { Spin } from 'antd'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'
import { useParams } from '@Router/index'

function CoursePlayerItem() {
  const [loading, setLoading] = useState(false)
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress()
  const { data: user } = Learner.Queries.useGetLearnerDetails()
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
  const onEnd = () => {
    updateProgress({
      courseId: courseId + '',
      sectionId: '' + '',
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

  const { data: course } = Learner.Queries.useGetCourseDetails(courseId + '')
  const {
    data: file,
    isFetching: loadingFile
  } = Learner.Queries.useGetFileDetails(item.file + '', {
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
        onLoadingStarted={() => setLoading(true)}
        onLoadingEnded={() => setLoading(false)}
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
        onLoadingStarted={() => setLoading(true)}
        onLoadingEnded={() => setLoading(false)}
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
      <Spin spinning={loading || loadingFile}>
        <div style={{ height: 550, width: '100%' }}>{Component}</div>
      </Spin>
    </ErrorBoundary>
  )
}

export default CoursePlayerItem
