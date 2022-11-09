import { Col, Collapse, List, Row, Space } from 'antd'

import { Course } from '../../../../../../types/Courses.types'
import CourseItemIcon from '../../../../../post-authentication/User/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'
import { LockOutlined } from '@ant-design/icons'

const { Panel } = Collapse

interface CourseCurriculumPropsI {
  course: Course;
}

function CourseCurriculum(props: CourseCurriculumPropsI) {
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        <Collapse defaultActiveKey={['1']}>
          {props.course.sections.map((section, index) => {
            return (
              <Panel header={section.title} key={index}>
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
