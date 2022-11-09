import { Card, Col, Row } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'
import {
  useGetCourseDetails,
  useUpdateCourse
} from '../../../../network/Courses/queries'

import CoursePlayerCollapsible from './CoursePlayerCollapsible/CoursePlayerCollapsible'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo'
import { cloneDeep } from 'lodash'
import { useEffect } from 'react'

function CoursePlayer() {
  const { id: courseId } = useParams()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const navigate = useNavigate()

  const sections = courseDetails.sections;

  useEffect(
    () => {
      if (sections[0]?.items[0]) {
        const itemId = sections[0].items[0].id
        navigate(`item/${itemId}`)
      }
    },
    [sections]
  )

  const toggleItemCheck = (id: string, checked: boolean) => {
    const COURSE_TREE = cloneDeep(sections)
    // const node = findNode(id, COURSE_TREE)
    // node.checked = checked
    // updateCourse({
    //   id: courseId + '',
    //   data: {
    //     sections: COURSE_TREE
    //   }
    // })
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={[0, 0]}>
        <Col span={17}>
          <Outlet context={[sections]} />
          <Card>
            <CoursePlayerMoreInfo course={courseDetails} />
          </Card>
        </Col>
        <Col span={7}>
          <CoursePlayerCollapsible
            toggleItemCheck={toggleItemCheck}
            sections={sections}
          />
        </Col>
      </Row>
    </div>
  )
}

export default CoursePlayer
