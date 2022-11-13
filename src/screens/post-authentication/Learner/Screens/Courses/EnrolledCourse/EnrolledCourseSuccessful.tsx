import {
  Avatar,
  Card,
  Col,
  Button,
  Menu,
  Result,
  Row,
  Tabs,
  Image,
  Typography,
  Progress
} from 'antd'

import { useGetCourseDetails, useGetCourses } from '@Learner/Api/queries'
import { useNavigate, useParams } from 'react-router'
import { Instructor } from '@Types/Instructor.types'
const { Title, Text } = Typography

const EnrolledCourseSuccessful: React.FC = () => {
  const { id: courseId } = useParams()
  const navigate = useNavigate()
  const { data: course } = useGetCourseDetails(courseId || '')
  console.log(course, 'coursecourse')
  const instructor = course.instructor as unknown as Instructor;
  return (
    <Row>
      <Col span={24}>
        <Card>
          <Result
            status="success"
            title="You have successfully enrolled for the course!"
            // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            // extra={[
            //   <Button type="primary" key="console">
            //     Go Console
            //   </Button>,
            //   <Button key="buy">Buy Again</Button>
            // ]}
          >
            <Row gutter={[20,20]} align='stretch'>
              <Col span={8}>
                <Image src={course.thumbnailImage} />
              </Col>
              <Col span={16}>
                <Row justify='space-between' align='stretch'>
                  <Col span={24}>
                    <Title level={3}>{course.title}</Title>
                  </Col>
                  <Col span={24}>
                    <Text >By { instructor.name}</Text>
                  </Col>
                  <Col span={24}>
                    <Text>Your Progress</Text>
                  <Progress percent={0} status="active" />
</Col>
                  <Col span={24}>
                    <Button type='primary' onClick={() => {
                      // navigate('../player')
                   }}>Start Course</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Result>
        </Card>
      </Col>
    </Row>
  )
}

export default EnrolledCourseSuccessful
