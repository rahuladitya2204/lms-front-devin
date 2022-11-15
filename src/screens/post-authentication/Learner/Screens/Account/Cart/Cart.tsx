import useCart from '@Store/useCart'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  Typography
} from 'antd'
import LearnerCartCourseCard from './CourseCard'

const { Title } = Typography

export default function LearnerCart () {
  const { addItemToCart, cartItems } = useCart(state => state)
  return (
    <Card>
      <Title>Cart</Title>

      <Row gutter={[20, 20]}>
        <Col span={18}>
          {cartItems.map(course => {
            return <LearnerCartCourseCard course={course} />
          })}
        </Col>
        <Col span={6}>
          <Title level={2}>Total: 6,998</Title>
          <Button type="primary" size="large">
            Checkout
          </Button>
        </Col>
      </Row>
    </Card>
  )
}
