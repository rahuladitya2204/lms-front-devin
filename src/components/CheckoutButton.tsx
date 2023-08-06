import { usePaymentCheckout } from '@Hooks/CommonHooks'
import { Learner } from '@adewaskar/lms-common'
import { Button, ButtonProps } from 'antd'

interface ProductCheckoutButtonPropsI extends ButtonProps {
  product: {
    type: string,
    id: string
  };
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
      onClick={() => {
        console.log('112')
        createOrder(
          { data: { type, id } },
          {
            onSuccess: ({ pgOrder, order }: any) => {
              console.log(pgOrder, order, 'order')
              openCheckout({ pgOrder, order }, (payment: any) => {
                console.log(payment, 'paymentpayment')
                updatePaymentOrder(
                  {
                    orderId: order._id,
                    status: 'successful',
                    data: payment
                  },
                  {
                    onSuccess: e => {
                      //   navigate(`../${order._id}/successful`)
                    }
                  }
                )
              })
              // @ts-ignore
              // navigate(`../${order._id}/successful`);
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
