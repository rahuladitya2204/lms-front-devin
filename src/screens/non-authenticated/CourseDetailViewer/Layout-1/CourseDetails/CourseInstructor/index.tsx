import {
  AntDesignOutlined,
  CommentOutlined,
  PlayCircleOutlined,
  StarOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons'
import { Avatar, Col, List, Row, Space, Typography } from 'antd'

import { Course } from '@Types/Courses.types'
import { Fragment } from 'react'
import { useGetInstructorDetails } from '@User/Api/queries'

const { Title, Text, Paragraph } = Typography

interface CourseInstructorPropsI {
  course: Course;
}

function CourseInstructor(props: CourseInstructorPropsI) {
  const { data: instructor } = useGetInstructorDetails(props.course.instructor)
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
            <div dangerouslySetInnerHTML={{ __html: instructor.aboutMe }} />
          </Paragraph>
        </Col>
      </Row>
      <Row />
    </Fragment>
  )
}

export default CourseInstructor
