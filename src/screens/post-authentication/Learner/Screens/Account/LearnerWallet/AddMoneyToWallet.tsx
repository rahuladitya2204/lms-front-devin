import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { Constants, Learner } from '@adewaskar/lms-common'

import useMessage from '@Hooks/useMessage'
import { usePaymentCheckout } from '@Hooks/CommonHooks'

interface AddMoneyToWalletPropsI {
  closeModal?: Function;
  // onSucces: () => void;
}

const { Text } = Typography

const AddMoneyToWallet = (props: AddMoneyToWalletPropsI) => {
  const message = useMessage()
  const { data: learner } = Learner.Queries.useGetLearnerDetails()
  const {
    mutate: createOrder,
    isLoading: createWalletOrder
  } = Learner.Queries.useCreateWalletOrder()
  const {
    mutate: updatePaymentOrder,
    isLoading: updatingPaymentOrder
  } = Learner.Queries.useUpdateOrderStatus()
  const [form] = Form.useForm()
  const { openCheckout } = usePaymentCheckout()
  const onSubmit = (data: { value: number }) => {
    if (data.value === 0) {
      return
    }
    createOrder(
      {
        data: {
          value: data.value,
          unit: Constants.DEFAULT_CURRENCY
        }
      },
      {
        onSuccess: ({ pgOrder, order }: any) => {
          if (!order.total.value) {
            return updatePaymentOrder(
              {
                orderId: order._id,
                status: 'successful',
                data: {}
              },
              {
                onSuccess: () => {
                  message.open({
                    type: 'success',
                    content: 'Money added succesfully'
                  })
                  form.resetFields()
                  props.closeModal && props.closeModal()
                }
              }
            )
          }
          openCheckout({ pgOrder, order }, (payment: any) => {
            updatePaymentOrder(
              {
                orderId: order._id,
                status: 'successful',
                data: payment
              },
              {
                onSuccess: () => props.closeModal && props.closeModal()
              }
            )
          })
        }
      }
    )
  }
  return (
    <Form onFinish={onSubmit} layout="vertical" form={form}>
      <Form.Item
        name="value"
        label="Enter amount"
        rules={[
          {
            required: true,
            message: 'Please enter a value'
          }
        ]}
      >
        <Row align={'middle'}>
          <Col>
            <Text style={{ fontSize: 20, marginRight: 10 }}>
              {/* @ts-ignore */}
              {Constants.UNIT_SYMBOLS[learner.wallet.balance.unit]}
            </Text>
          </Col>
          <Col>
            <Input type="number" />
          </Col>
        </Row>
      </Form.Item>
      <Button
        loading={createWalletOrder || updatingPaymentOrder}
        onClick={form.submit}
        block
        type="primary"
      >
        Add Money
      </Button>
    </Form>
  )
}

export default AddMoneyToWallet
