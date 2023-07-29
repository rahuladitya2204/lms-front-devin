import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  List,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import { Learner, Utils } from '@adewaskar/lms-common'

import LearnerCartCourseItem from './CourseItem'
import useMessage from '@Hooks/useMessage';
import { useNavigate } from 'react-router';
import { usePaymentCheckout } from '@Hooks/CommonHooks';

const { Title, Text } = Typography
const { UnitTypeToStr } = Utils;

export default function LearnerCart() {
  const message = useMessage();
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const { openCheckout} = usePaymentCheckout();
  const { mutate: updateCart } = Learner.Queries.useUpdateCartItems()
  // @ts-ignore
  const { data: { items, promo,total,discount,totalBeforeDiscount } } = Learner.Queries.useGetCartDetails()

  const removeItemFromCart = (id: string) => {
    updateCart({ data: { courseId: id }, action: 'remove' })
  }

  const { mutate: createOrder } = Learner.Queries.useCreateOrder();
  const { mutate: createPaymentOrder,isLoading: creatingPaymentOrder } = Learner.Queries.useCreatePaymentOrder();
  const { mutate: updatePaymentOrder } = Learner.Queries.useUpdateOrderStatus();

  const applyCode = ({ code }: { code: string }) => {
    updateCart({ data: { promoCode: code }, action: 'apply_code' },{
      onSuccess: () => {
        message.open({
          type: 'success',
          content: `${code} applied successfully`
        })
        form.resetFields();
      },
      onError: () => {
        message.open({
          type: 'error',
          content: `Invalid Code`
        })
      }
    })
  }

  return (
    <Card>
      <Title>Cart</Title>
          {items.length?    <Row gutter={[20, 20]}>
        <Col span={13}>
          <List
            itemLayout="horizontal"
            dataSource={items}
       // @ts-ignore
            renderItem={({ course, price, discount }, index) => (
              <LearnerCartCourseItem
                removeItemFromCart={removeItemFromCart}
                course={course}
                price={price}
                discount={discount}
              />
            )}
          />
        </Col>
        <Col span={2} />
        <Col span={7}>
<Row>
  <Col flex={1}>
  <Form form={form} onFinish={applyCode} layout='horizontal'>
              <Form.Item name="code">
                <Input />
              </Form.Item>
            </Form>
            </Col>
            <Col style={{marginLeft:20}}>
            <Button onClick={form.submit}>Apply Code</Button>
          </Col>
</Row>
                     <List header={<Text strong>Cart Totals</Text>} bordered>
           {totalBeforeDiscount? <List.Item style={{ display: 'block' }}>
              <Space
                style={{ display: 'flex', justifyContent: 'space-between' }}
                size="large"
              >
                <Typography.Text>Sub Total</Typography.Text>
                <Typography.Text strong>
                  {UnitTypeToStr(totalBeforeDiscount) }</Typography.Text>
              </Space>
            </List.Item> : null}
            {totalBeforeDiscount? <List.Item style={{ display: 'block' }}>
              <Space
                style={{ display: 'flex', justifyContent: 'space-between' }}
                size="large"
              >
                <Typography.Text>Discount</Typography.Text>
                <Typography.Text strong>
                  {UnitTypeToStr(discount) }</Typography.Text>
              </Space>
            </List.Item>:null}
            {promo ? (
              <>
                 <List.Item style={{ display: 'block' }}>
                <Row justify={'space-between'}>
                  <Col>
                    {' '}
                    <Typography.Text>Coupon</Typography.Text>
                  </Col>
                  <Col>
                      <Tag closable onClose={e => {
                        updateCart({ data: { promoCode: promo.code }, action: 'remove_code' });
                    }} style={{ marginRight: 0 }} color="blue">
                      {/* @ts-ignore */}
                      <Typography.Text strong>{promo.code}</Typography.Text>
                    </Tag>
                  </Col>
                </Row>
                </List.Item>
                <List.Item style={{ display: 'block' }}>
                <Row justify={'space-between'}>
                  <Col>
                    {' '}
                    <Typography.Text>Discount</Typography.Text>
                  </Col>
                  <Col>
                    <Tag style={{ marginRight: 0 }} color="volcano">
                      {/* @ts-ignore */}
                      <Typography.Text strong>{UnitTypeToStr(discount)}</Typography.Text>
                    </Tag>
                  </Col>
                </Row>
                </List.Item>
              </>
            ) : null}

            <List.Item style={{ display: 'block' }}>
              <Space
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography.Text style={{fontSize:20}}>Total</Typography.Text>
                <Typography.Text style={{fontSize:24}} strong>
                {UnitTypeToStr(total)}
                </Typography.Text>
              </Space>
            </List.Item>
            {/* <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text>12312
            </List.Item> */}
          </List>
          {/* <Title level={2}>Total: 6,998</Title> */}
          <Button onClick={() => {
            createOrder(undefined, {
              onSuccess: (order) => {
                console.log(order, 'order');
                createPaymentOrder({
                  amount: order.total.value,
                  currency: 'INR',
                }, {
                  onSuccess: (pgOrder => {
                    // @ts-ignore
                    openCheckout(pgOrder, (payment) => {
                      console.log(payment, 'paymentpayment');
                      updatePaymentOrder({
                        orderId: order._id,
                        status: 'successful',
                        data: payment
                      }, {
                        onSuccess: (e) => {
                          navigate(`../${order._id}/successful`);
                        }
                      });
                    });
                  })
                })
                // @ts-ignore
                // navigate(`../${order._id}/successful`);
              }
            });
          }} loading={creatingPaymentOrder} style={{ marginTop: 20 }} block type="primary" size="large">
            Checkout
          </Button>
        </Col>
      </Row>:<Empty description='No Items added'/>}

  
    </Card>
  )
}
