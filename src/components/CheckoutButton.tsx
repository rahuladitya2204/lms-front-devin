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
  const {
    mutate: updatePaymentOrder,
    isLoading: updatingPaymentOrder
  } = Learner.Queries.useUpdateOrderStatus({ id, type })

  return (
    <Button
      size="large"
      onClick={() => {
        createOrder(
          { data: { type, id } },
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
                    onSuccess: props.onSuccess
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
                    onSuccess: props.onSuccess
                  }
                )
              })
            }
          }
        )
      }}
      loading={isCreatingOrder || updatingPaymentOrder}
      {...props}
    >
      {props.children}
    </Button>
  )
}
