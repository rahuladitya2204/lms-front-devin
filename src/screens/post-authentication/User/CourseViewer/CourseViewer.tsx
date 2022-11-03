import { Card, Col, Row } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'
import {
  useGetCourseDetails,
  useUpdateCourse
} from '../../../../queries/Courses/CoursesQueries'

import CourseViewerCollapsible from './CourseViewerCollapsible/CourseViewerCollapsible'
import CourseViewerMoreInfo from './CourseViewerMoreInfo/CourseViewerMoreInfo'
import { cloneDeep } from 'lodash'
import { findNode } from '../../Admin/CourseBuilder/utils'
import styled from '@emotion/styled'
import { useEffect } from 'react'

function CourseViewer() {
  const { id: courseId } = useParams()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const navigate = useNavigate()

  const courseTree = courseDetails.courseTree

  useEffect(
    () => {
      if (courseTree[0]?.children[0]) {
        const itemId = courseTree[0].children[0].id
        navigate(`item/${itemId}`)
      }
    },
    [courseTree]
  )
  console.log(courseDetails, 'details')

  const toggleItemCheck = (id: string, checked: boolean) => {
    const COURSE_TREE = cloneDeep(courseTree)
    const node = findNode(id, COURSE_TREE)
    node.checked = checked;
    updateCourse({
      id: courseId + '',
      data: {
        courseTree: COURSE_TREE
      }
    })
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={[0, 0]}>
        <Col span={17}>
          <Outlet context={[courseTree]} />
          <Card>
            <CourseViewerMoreInfo />
          </Card>
        </Col>
        <Col span={7}>
          <CourseViewerCollapsible
            toggleItemCheck={toggleItemCheck}
            courseTree={courseTree}
          />
        </Col>
      </Row>
    </div>
  )
}

export default CourseViewer
