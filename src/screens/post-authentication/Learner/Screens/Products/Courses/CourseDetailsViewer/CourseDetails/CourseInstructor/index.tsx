import {
  AntDesignOutlined,
  CommentOutlined,
  PlayCircleOutlined,
  StarOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons'
import { Avatar, Col, Row } from 'antd'

import CourseReviews from '../CourseReviews/CourseReviews'
import { Fragment } from 'react'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import { Types } from '@invinciblezealorg/lms-common'
import { Typography } from '@Components/Typography'
import { User } from '@invinciblezealorg/lms-common'

const { Title, Text, Paragraph } = Typography

interface CourseUserPropsI {
  course: Types.Course;
}

function CourseUser(props: CourseUserPropsI) {
  const { course } = props;
  const user = course.user as unknown as Types.User;
  return (
    <Fragment>
      <Row gutter={[25, 25]}>
        <Col span={24}>
          <Title level={4}>About the User</Title>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={4}>
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                src={user.image}
              />
            </Col>
            <Col span={18}>
              <Title level={5}>{user.name}</Title>
              <Text>{user.designation}</Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={6}>
              <StarOutlined />{' '}
              <Text>{user.rating} User rating</Text>
            </Col>
            <Col span={6}>
              <CommentOutlined /> <Text>1,533 Reviews</Text>
            </Col>
            <Col span={6}>
              <UsergroupAddOutlined /> <Text>16,322 Students</Text>
            </Col>
            <Col span={6}>
              <PlayCircleOutlined /> <Text>{user.courses} Courses</Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Paragraph>
            <HtmlViewer content={user.aboutMe} />
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

export default CourseUser
