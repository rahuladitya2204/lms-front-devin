import { Card, Col, Row } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'

import CoursePlayerCollapsible from './CoursePlayerCollapsible/CoursePlayerCollapsible'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo'
import { cloneDeep } from 'lodash'
import { useEffect } from 'react'
import { useGetCourseDetails } from '@Learner/Api/queries'
import { useGetNodeFromRouterOutlet } from '@Hooks/CommonHooks'

function CoursePlayer() {
  const { id: courseId } = useParams()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })
  // const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const navigate = useNavigate()

  const sections = courseDetails.sections

  useEffect(
    () => {
      if (sections[0]?.items[0]) {
        const sectionId = sections[0].id
        const itemId = sections[0].items[0].id
        navigate(`section/${sectionId}/item/${itemId}`)
      }
    },
    [sections]
  )

  const toggleItemCheck = (id: string, checked: boolean) => {
    // const COURSE_TREE = cloneDeep(sections)
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
      <Row gutter={[10, 10]}>
        <Col span={17}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Card
                bordered={false}
                style={{ height: 500, overflow: 'scroll' }}
                bodyStyle={{ padding: 0 }}
              >
                <Outlet context={[sections]} />
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <CoursePlayerMoreInfo course={courseDetails} />
              </Card>
            </Col>
          </Row>
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
