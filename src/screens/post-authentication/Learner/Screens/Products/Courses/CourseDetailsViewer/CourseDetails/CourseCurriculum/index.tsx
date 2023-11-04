import { Col, Collapse, List, Row, Skeleton, Tag } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import CourseCurriculumItem from './CurriculumItem'

const { Panel } = Collapse

interface CourseCurriculumPropsI {
  course: Types.Course;
}

function CourseCurriculum(props: CourseCurriculumPropsI) {
  const courseId = props.course._id
  const {
    data: course,
    isFetching: loadingCourse
  } = Learner.Queries.useGetCourseDetails(courseId, {
    enabled: !!courseId
  })
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        {loadingCourse ? (
          <Skeleton active paragraph={{rows: 20}} />
        ) : (
          <Collapse defaultActiveKey={course.sections.map((s, i) => i)}>
            {course.sections.map((section, index) => {
              return (
                <Panel header={section.title} key={index}>
                  <List
                    itemLayout="horizontal"
                    dataSource={section.items}
                    renderItem={item => {
                      return <CourseCurriculumItem item={item} />
                    }}
                  />
                </Panel>
              )
            })}
          </Collapse>
        )}
      </Col>
    </Row>
  )
}

export default CourseCurriculum
