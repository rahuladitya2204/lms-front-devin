import { Card, Col, Collapse, Row, Typography } from 'antd'
import { Outlet, useParams } from 'react-router'

import CourseViewerCollapsible from './CourseViewerCollapsible/CourseViewerCollapsible'
import styled from '@emotion/styled'
import { useGetCourseDetails } from '../../../../queries/Courses/CoursesQueries'

const CollapseCardHolder = styled(Card)`
  max-height: 800px;
  overflow: scroll;
`

function CourseViewer () {
  const { id: courseId } = useParams()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  const courseTree = courseDetails.courseTree

  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={17}>
          <Outlet context={[courseTree]} />{' '}
        </Col>
        <Col span={7}>
          <CollapseCardHolder bodyStyle={{ padding: 0 }}>
            <CourseViewerCollapsible courseTree={courseTree} />
          </CollapseCardHolder>
        </Col>
      </Row>
    </div>
  )
}

export default CourseViewer
