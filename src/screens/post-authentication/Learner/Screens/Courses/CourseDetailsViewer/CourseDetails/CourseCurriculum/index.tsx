import { Col, Collapse, List, Row, Tag } from 'antd'

import CourseCurriculumItem from './CurriculumItem'
import { Types } from '@adewaskar/lms-common'

const { Panel } = Collapse

interface CourseCurriculumPropsI {
  course: Types.Course;
}

function CourseCurriculum(props: CourseCurriculumPropsI) {
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        <Collapse defaultActiveKey={props.course.sections.map((s, i) => i)}>
          {props.course.sections.map((section, index) => {
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
      </Col>
    </Row>
  )
}

export default CourseCurriculum
