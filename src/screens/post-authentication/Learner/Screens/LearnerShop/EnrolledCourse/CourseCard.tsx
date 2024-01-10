import { Button, Card, Col, Result, Row, Space } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import { Link } from 'react-router-dom'
import { Typography } from '@Components/Typography'

const { Title, Text } = Typography

interface EnrolledCourseCardPropsI {
    courseId: string;
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardPropsI> = (props) => {
  const { data: course } = Learner.Queries.useGetCourseDetails(
    props.courseId + ''
  )
  const user = course.user as unknown as Types.User;
  return (
    <Row gutter={[20, 20]} align="middle" justify="center">
      <Col span={8}>
        <Image preview={false} src={course.thumbnailImage} />
      </Col>
      <Col span={16}>
        <Space direction="vertical">
          <Space
            direction="vertical"
            style={{
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <Title style={{ margin: 0 }} level={3}>
              {course.title}
            </Title>
            <Text>By {user?.name}</Text>
          </Space>
          <Link to={`../courses`}>
                      <Button style={{ marginTop:15}}
              type="primary"
              onClick={() => {
                // navigate('./player', { replace: true });
              }}
            >
              Start Course
            </Button>
          </Link>
        </Space>
      </Col>
    </Row>
  )
}

export default EnrolledCourseCard
