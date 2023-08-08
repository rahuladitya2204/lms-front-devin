import {
  AntDesignOutlined,
  CommentOutlined,
  PlayCircleOutlined,
  StarOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons'
import { Avatar, Col, Row, Typography } from 'antd'

import CourseReviews from '../CourseReviews/CourseReviews'
import { Fragment } from 'react'
import HtmlViewer from '@Components/HtmlViewer'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

const { Title, Text, Paragraph } = Typography

interface CourseInstructorPropsI {
  course: Types.Course;
}

function CourseInstructor(props: CourseInstructorPropsI) {
  const { course } = props;
  const instructor = course.instructor as unknown as Types.Instructor;
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
                src={instructor.image}
              />
            </Col>
            <Col span={18}>
              <Title level={5}>{instructor.name}</Title>
              <Text>{instructor.designation}</Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={6}>
              <StarOutlined />{' '}
              <Text>{instructor.rating} Instructor rating</Text>
            </Col>
            <Col span={6}>
              <CommentOutlined /> <Text>1,533 Reviews</Text>
            </Col>
            <Col span={6}>
              <UsergroupAddOutlined /> <Text>16,322 Students</Text>
            </Col>
            <Col span={6}>
              <PlayCircleOutlined /> <Text>{instructor.courses} Courses</Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Paragraph>
            <HtmlViewer content={instructor.aboutMe} />
          </Paragraph>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <CourseReviews course={props.course} />
        </Col>
      </Row>
      <Row />
    </Fragment>
  )
}

export default CourseInstructor
