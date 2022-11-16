import {
  useGetCartItems,
  useUpdateCartItems
} from '@Learner/Api/Common/queries'
import { Card, Col, List, Row, Space, Typography } from 'antd'
import LearnerCartCourseCard from './CourseCard'

const { Title, Text } = Typography

export default function LearnerCart() {
  const { mutate: updateCart } = useUpdateCartItems()
  const { data: cartItems } = useGetCartItems()
  console.log(cartItems, 'cart')

  const removeItemFromCart = (id: string) => {
    updateCart({ courseId: id, action: 'remove' })
  }

  return (
    <Card>
      <Title>Cart</Title>
      <Row gutter={[20, 20]}>
        <Col span={16}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              {cartItems.map(course => {
                return (
                  <LearnerCartCourseCard
                    removeItemFromCart={removeItemFromCart}
                    course={course}
                  />
                )
              })}
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <List header={<Text strong>Cart Totals</Text>} bordered>
            <List.Item style={{ display: 'block' }}>
              <Space
                style={{ display: 'flex', justifyContent: 'space-between' }}
                size="large"
              >
                <Typography.Text>Sub Total</Typography.Text>
                <Typography.Text strong>Sub Total</Typography.Text>
              </Space>
            </List.Item>
            <List.Item style={{ display: 'block' }}>
              <Space
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography.Text>Discount</Typography.Text>
                <Typography.Text strong>18%</Typography.Text>
              </Space>
            </List.Item>
            <List.Item style={{ display: 'block' }}>
              <Space
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography.Text>Total</Typography.Text>
                <Typography.Text strong>1888$</Typography.Text>
              </Space>
            </List.Item>
            {/* <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text>12312
            </List.Item> */}
          </List>
          {/* <Title level={2}>Total: 6,998</Title>
          <Button type="primary" size="large">
            Checkout
          </Button> */}
        </Col>
      </Row>
    </Card>
  )
}
