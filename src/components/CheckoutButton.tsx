import AddMoneyToWallet, { useCreateWallterOrder } from '@Learner/Screens/Account/LearnerWallet/AddMoneyToWallet'
import { Button, ButtonProps, Modal } from 'antd'
import { Enum, Learner, Types } from '@adewaskar/lms-common'

import ActionModal from './ActionModal/ActionModal'
import { usePaymentCheckout } from '@Hooks/CommonHooks'
import { useRef } from 'react'

const { confirm } = Modal
interface ProductCheckoutButtonPropsI extends ButtonProps {
  product: {
    type: string,
    id: string
  };
  plan: Types.Plan;
  onSuccess: () => void;
}

export default function ProductCheckoutButton(
  props: ProductCheckoutButtonPropsI
) {
  // const {} = Learner.Queries.usegetproductD
  const { openCheckout } = usePaymentCheckout();
  const { product: { id, type }, plan } = props
  const {
    mutate: createOrder,
    isLoading: isCreatingOrder
  } = Learner.Queries.useCreateOrderFromProduct();
  const { addMoney, isLoading } = useCreateWallterOrder();
  const { data: { wallet } } = Learner.Queries.useGetLearnerDetails()
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
    <>
     <Button
      size="large"
      onClick={() => {
        if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
          if (wallet.balance.value < plan.finalPrice.value) {
            confirm({
              closable: false,
              title: `There is insufficient balance in your wallet`,
              // icon: <ExclamationCircleOutlined />,
              content: `Add money and buy this ${type}`,
              // footer: [

              // ],
              onOk() {
                addMoney({
                  amount: plan.finalPrice,
                  onSuccess: () => {
                    console.log('its done, lets create now?')
                    CreateOrder()
                  }
                })
              },
              okText: 'Yes, Purchase'
            })
          } else {
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
        }
        if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
          CreateOrder()
        }
      }}
      loading={isCreatingOrder || updatingPaymentOrder || isLoading}
      {...props}
    >
      {props.children}
    </Button>
    </>
  )
}
