import { Col, Collapse, List, Row, Tag } from 'antd'

import { Course, CourseSectionItem } from '@Types/Courses.types'
import { LockOutlined, PlayCircleOutlined } from '@ant-design/icons'
import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'
import ActionModal from '@Components/ActionModal'
import MediaPlayer from '@Components/MediaPlayer'

const { Panel } = Collapse

interface CourseCurriculumPropsI {
  course: Course;
}

function CourseCurriculum(props: CourseCurriculumPropsI) {
  const PreviewVideo = (item: CourseSectionItem) => (
    <ActionModal title="Preview Video" cta={<PlayCircleOutlined />}>
      <MediaPlayer url={item.metadata?.url || ''} />
    </ActionModal>
  )
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
                  renderItem={item => {
                    let actions = []
                    if (item.isPreview) {
                      if (item.type === 'video') {
                        actions.push(<Tag color="blue">Preview Available</Tag>)
                        actions.push(PreviewVideo(item))
                      }
                    } else {
                      actions.push(<LockOutlined />)
                    }
                    return (
                      <List.Item actions={actions}>
                        <List.Item.Meta
                          avatar={
                            <CourseItemIcon  type="outlined" item={item} />
                          }
                          title={item.title}
                        />
                      </List.Item>
                    )
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
