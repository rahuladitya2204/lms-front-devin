import { Button, ButtonProps } from 'antd'

import { Learner } from '@adewaskar/lms-common'
import { usePaymentCheckout } from '@Hooks/CommonHooks'

interface ProductCheckoutButtonPropsI extends ButtonProps {
  product: {
    type: string,
    id: string
  };
  onSuccess: () => void;
}

export default function ProductCheckoutButton(
  props: ProductCheckoutButtonPropsI
) {
  const { openCheckout } = usePaymentCheckout()
  const { product: { id, type } } = props
  const {
    mutate: createOrder,
    isLoading: isCreatingOrder
  } = Learner.Queries.useCreateOrderFromProduct()
  const { mutate: updatePaymentOrder } = Learner.Queries.useUpdateOrderStatus()

  return (
    <Button
      size="large"
      onClick={() => {
        console.log('112')
        createOrder(
          { data: { type, id } },
          {
            onSuccess: ({ pgOrder, order }: any) => {
              console.log(pgOrder, order, 'order')
              if (!order.total.value) {
                return updatePaymentOrder(
                  {
                    orderId: order._id,
                    status: 'successful',
                    data: {}
                  },
                  {
                    onSuccess: props.onSuccess
                  }
                )
              }
              openCheckout({ pgOrder, order }, (payment: any) => {
                console.log(payment, 'paymentpayment')
                updatePaymentOrder(
                  {
                    orderId: order._id,
                    status: 'successful',
                    data: payment
                  },
                  {
                    onSuccess: props.onSuccess
                  }
                )
              })
            }
          }
        )
      }}
      loading={isCreatingOrder}
      {...props}
    >
      {props.children}
    </Button>
  )
}
