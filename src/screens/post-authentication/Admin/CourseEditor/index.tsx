import { Button, Card, Col, Row, Tabs } from 'antd'
import {
  INITIAL_COURSE_DETAILS,
  useGetCourseDetails,
  useUpdateCourse
} from '../../../../queries/Courses/CoursesQueries'
import { Outlet, useParams } from 'react-router'

import CourseDetailsEditor from '../CourseDetailsEditor'
import styled from '@emotion/styled'
import { useState } from 'react'

const AddChapterButton = styled(Button)`
  margin-top: 20px;
`

function CourseEditor () {
  const { id: courseId } = useParams()
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })
  //   const instructionListItems=courseDetails.item
  const saveCourse = () => {
    updateCourse({
      id: courseId + '',
      data: course
    })
  }
  const [course, setCourse] = useState(INITIAL_COURSE_DETAILS)
  return (
    <Card>
      <Tabs
        defaultActiveKey="1"
        // onChange={onChange}
        items={[
          {
            label: `Details`,
            key: '1',
            children: <CourseDetailsEditor />
          },
          {
            label: `Pricing`,
            key: '2',
            children: `Content of Tab Pane 2`
          },
          {
            label: `Pages`,
            key: '3',
            children: `Content of Tab Pane 3`
          },
          {
            label: `Advanced`,
            key: '4',
            children: `Content of Tab Pane 3`
          }
        ]}
      />

      <Outlet />
    </Card>
  )
}

export default CourseEditor
