import { Button, ButtonProps, Modal } from 'antd'
import { Enum, Learner } from '@adewaskar/lms-common'

import { usePaymentCheckout } from '@Hooks/CommonHooks'

const { confirm } = Modal
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
  const { data: organisation } = Learner.Queries.useGetOrgDetails()
  const transactionStrategy = organisation.transaction.strategy
  const CreateOrder = () => {
    createOrder(
      { data: { type, id } },
      {
        onSuccess: ({ pgOrder, order }: any) => {
          if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
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
          if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
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
        }
      }
    )
  }
  return (
    <Button
      size="large"
      onClick={() => {
        if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
          confirm({
            title: `Are you sure, you want to buy ${props.product.type}`,
            // icon: <ExclamationCircleOutlined />,
            content: `Money will be deducted from your wallet`,
            onOk() {
              CreateOrder()
            },
            okText: 'Yes, Purchase'
          })
        }
        if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
          CreateOrder()
        }
      }}
      loading={isCreatingOrder || updatingPaymentOrder}
      {...props}
    >
      {props.children}
    </Button>
  )
}
