import AddMoneyToWallet, { useCreateWallterOrder } from '@Learner/Screens/Account/LearnerWallet/AddMoneyToWallet'
import { Button, ButtonProps, Modal } from 'antd'
import { Enum, Learner, Types, Utils } from '@adewaskar/lms-common'

import ActionModal from './ActionModal/ActionModal'
import ProductWalletNudge from './ProductWalletNudge'
import { usePaymentCheckout } from '@Hooks/CommonHooks'
import { useRef } from 'react'

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
  // const {} = Learner.Queries.usegetproductD
  const { openCheckout } = usePaymentCheckout();
  const { product: { id, type } } = props;
  const { data: {
    // @ts-ignore
    plan
  } } = Learner.Queries.useGetProductDetail(props.product);
  console.log(plan, 'pupupu');
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
  const isFree = plan.type === 'free';
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
      <ProductWalletNudge product={props.product} />
     <Button
      size="large"
        onClick={() => {
          if (plan.finalPrice.value === 0) {
            return CreateOrder();
        }
        if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
          if (wallet.balance.value < plan.finalPrice.value) {
            const leftAmount = { value: plan.finalPrice.value - wallet.balance.value, unit: plan.finalPrice.unit };
            confirm({
              closable: false,
              title: `There is insufficient balance in your wallet`,
              // icon: <ExclamationCircleOutlined />,
              content: `Add ${Utils.UnitTypeToStr(leftAmount)} and buy this ${type}`,
              // footer: [

              // ],
              onOk() {
                addMoney({
                  amount: leftAmount,
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
              okText: 'Confirm Purchase'
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
      {props.children || (isFree?'Enroll Now':'Buy Now')}
    </Button>
    </>
  )
}
