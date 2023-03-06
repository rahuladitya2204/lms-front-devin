import {
  Avatar,
  Button,
  Card,
  Col,
  Result,
  Row,
  Space,
  Typography
} from 'antd'

import Image from '@Components/Image'
import { Instructor } from '@Types/Instructor.types'
import { Link } from 'react-router-dom'
import { useGetCourseDetails } from '@Learner/Api/Course/queries'
import { useParams } from 'react-router'

const { Title, Text } = Typography

const EnrolledCourseSuccessful: React.FC = () => {
  const { id: courseId } = useParams()
  const { data: course } = useGetCourseDetails(courseId || '')

  const instructor = course.instructor as unknown as Instructor;
  return (
    <Row>
      <Col span={24}>
        <Card>
          <Result
            status="success"
            title="You have successfully enrolled for the course!"
          >
            <Row gutter={[20,20]} align='middle' justify='center'>
              <Col span={8}>
                <Image preview={false} src={course.thumbnailImage} />
              </Col>
              <Col span={16}>
                <Space direction='vertical'>
                  <Space direction='vertical' style={{display:'flex',justifyContent:'space-around'}}>
                  <Title style={{margin: 0}} level={3}>{course.title}</Title>
                <Text >By { instructor.name}</Text>
                  </Space>
                  <Link to={`../${courseId}/player`}>
                  <Button type='primary' onClick={() => {
                    // navigate('./player', { replace: true });
                    }}>Start Course</Button>
                    </Link>
                </Space>

              </Col>
            </Row>
          </Result>
        </Card>
      </Col>
    </Row>
  )
}

export default EnrolledCourseSuccessful
