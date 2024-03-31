import { Button, Card, Col, Result, Row } from 'antd'

import EnrolledCourseCard from './CourseCard'
import { Learner } from '@adewaskar/lms-common'
import { useParams } from '@Router/index'

const EnrolledCourseSuccessful: React.FC = () => {
  const { orderId } = useParams()
  const { data: order } = Learner.Queries.useGetOrderDetails(orderId + '')
  console.log(order, 'orderr')
  // const user = course.user as unknown as Types.User;
  return (
    <Row>
      <Col span={24}>
        <Card>
          <Result
            status="success"
            title="You have successfully enrolled for the course!"
          >
            <Row gutter={[30, 30]}>
              {order.transaction.data.products.map(item => {
                return (
                  <Col span={24}>
                    <EnrolledCourseCard courseId={item.product.id} />
                  </Col>
                )
              })}
            </Row>
          </Result>
        </Card>
      </Col>
    </Row>
  )
}

export default EnrolledCourseSuccessful
