import {
  AntDesignOutlined,
  CommentOutlined,
  PlayCircleOutlined,
  StarOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons'
import { Avatar, Col, List, Row, Space, Typography } from 'antd'

import { Fragment } from 'react'

const { Title, Text, Paragraph } = Typography

interface CourseInstructorPropsI {
  //   renderItem: (item: string) => ReactNode;
  //   data: string[];
}

function CourseInstructor(props: CourseInstructorPropsI) {
  return (
    <Fragment>
      <Row gutter={[25, 25]}>
        <Col span={24}>
          <Title level={4}>About the Instructor</Title>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={4}>
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<AntDesignOutlined />}
              />
            </Col>
            <Col span={18}>
              <Title level={5}>Lauren Handerson</Title>
              <Text>iOS Developer & UI Designer</Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={6}>
              <StarOutlined /> <Text>4.87 Instructor rating</Text>
            </Col>
            <Col span={6}>
              <CommentOutlined /> <Text>1,533 Reviews</Text>
            </Col>
            <Col span={6}>
              <UsergroupAddOutlined /> <Text>16,322 Students</Text>
            </Col>
            <Col span={6}>
              <PlayCircleOutlined /> <Text>4 Courses</Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Paragraph>
            My passion is helping people to learn new skills in a short-term
            course and achieve their goals. I've been designing for more than
            ten years and developing iOS apps for four years. It's my honor if I
            could help you learn to program in a simple word. I currently am
            teaching iOS 13, Swift 5, ARKit 3, Sketch 5, Illustrator, Photoshop,
            Cinema 4D, HTML, CSS, JavaScript, etc.
          </Paragraph>
        </Col>
      </Row>
      <Row />
    </Fragment>
  )
}

export default CourseInstructor
