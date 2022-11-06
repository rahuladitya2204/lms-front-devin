import { Card, Col, Row } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'
import {
  useGetCourseDetails,
  useUpdateCourse
} from '../../../../queries/Courses/CoursesQueries'

import CoursePlayerCollapsible from './CoursePlayerCollapsible/CoursePlayerCollapsible'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo/CoursePlayerMoreInfo'
import { cloneDeep } from 'lodash'
import { findNode } from '../../Admin/CourseBuilder/utils'
import { useEffect } from 'react'

function CoursePlayer() {
  const { id: courseId } = useParams()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const navigate = useNavigate()

  const courseSections = courseDetails.courseSections

  useEffect(
    () => {
      if (courseSections[0]?.items[0]) {
        const itemId = courseSections[0].items[0].id
        navigate(`item/${itemId}`)
      }
    },
    [courseSections]
  )
  console.log(courseDetails, 'details')

  const toggleItemCheck = (id: string, checked: boolean) => {
    const COURSE_TREE = cloneDeep(courseSections)
    const node = findNode(id, COURSE_TREE)
    node.checked = checked
    updateCourse({
      id: courseId + '',
      data: {
        courseSections: COURSE_TREE
      }
    })
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={[0, 0]}>
        <Col span={17}>
          <Outlet context={[courseSections]} />
          <Card>
            <CoursePlayerMoreInfo />
          </Card>
        </Col>
        <Col span={7}>
          <CoursePlayerCollapsible
            toggleItemCheck={toggleItemCheck}
            courseSections={courseSections}
          />
        </Col>
      </Row>
    </div>
  )
}

export default CoursePlayer
