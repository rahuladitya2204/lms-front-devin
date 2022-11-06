import { Button, Card, Col, Row } from 'antd'
import {
  INITIAL_COURSE_DETAILS,
  useGetCourseDetails,
  useUpdateCourse
} from '../../../../queries/Courses/CoursesQueries'

import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { useState } from 'react'

const AddChapterButton = styled(Button)`
  margin-top: 20px;
`

function CourseLandingPageBuilderScreen () {
  const { id: courseId } = useParams()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()

  const saveCourse = () => {
    updateCourse({
      id: courseId + '',
      data: course
    })
  }
  const [course, setCourse] = useState(INITIAL_COURSE_DETAILS)
  return <div className="site-card-wrapper" />
}

export default CourseLandingPageBuilderScreen
