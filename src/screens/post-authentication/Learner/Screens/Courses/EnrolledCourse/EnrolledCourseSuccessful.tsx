import { Button, Card, Col, Result, Row, Space, Typography } from 'antd'

import EnrolledCourseCard from './CourseCard'
import Image from '@Components/Image'
import { Learner } from '@adewaskar/lms-common'
import { Link } from 'react-router-dom'
import { Types } from '@adewaskar/lms-common'
import { useParams } from 'react-router'

const { Title, Text } = Typography

const EnrolledCourseSuccessful: React.FC = () => {
  const { orderId } = useParams()
  const { data: order } = Learner.Queries.useGetOrderDetails(orderId + '')

  // const instructor = course.instructor as unknown as Types.Instructor;
  return (
    <Row>
      <Col span={24}>
        <Card>
          <Result
            status="success"
            title="You have successfully enrolled for the course!"
          >
            {order.items.map(item => {
              return <EnrolledCourseCard courseId={item.course} />
            })}
          </Result>
        </Card>
      </Col>
    </Row>
  )
}

export default EnrolledCourseSuccessful
