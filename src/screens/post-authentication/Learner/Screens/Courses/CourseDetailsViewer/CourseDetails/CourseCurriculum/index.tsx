import { Col, Collapse, List, Row } from 'antd'

import { Course } from '@Types/Courses.types'
import { LockOutlined } from '@ant-design/icons'
import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'

const { Panel } = Collapse

interface CourseCurriculumPropsI {
  course: Course;
}

function CourseCurriculum(props: CourseCurriculumPropsI) {
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        <Collapse defaultActiveKey={props.course.sections.map(s => s.id)}>
          {props.course.sections.map((section, index) => {
            return (
              <Panel header={section.title} key={section.id}>
                <List
                  itemLayout="horizontal"
                  dataSource={section.items}
                  renderItem={item => (
                    <List.Item actions={[<LockOutlined />]}>
                      <List.Item.Meta
                        avatar={<CourseItemIcon type="outlined" item={item} />}
                        title={item.title}
                      />
                    </List.Item>
                  )}
                />
              </Panel>
            )
          })}
        </Collapse>
      </Col>
    </Row>
  )
}

export default CourseCurriculum
