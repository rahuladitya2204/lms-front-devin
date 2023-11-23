import { Button, Form, Input } from 'antd'
import { Constants, Learner } from '@adewaskar/lms-common'

import { usePaymentCheckout } from '@Hooks/CommonHooks'

interface AddMoneyToWalletPropsI {
  closeModal?: Function;
  // onSucces: () => void;
}

const AddMoneyToWallet = (props: AddMoneyToWalletPropsI) => {
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
                onSuccess: () => props.closeModal && props.closeModal()
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
      <Form.Item name="value" label="Enter amount">
        <Input type="number" />
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
