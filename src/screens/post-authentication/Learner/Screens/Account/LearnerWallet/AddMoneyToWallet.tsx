import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { Constants, Learner, Types, Utils } from '@adewaskar/lms-common'

import CoinImage from './CoinImage'
import { useEffect } from 'react'
import useMessage from '@Hooks/useMessage'
import { usePaymentCheckout } from '@Hooks/CommonHooks'

interface AddMoneyToWalletPropsI {
  closeModal?: Function;
  amount?: Types.ValueUnitType;
  onSucces?: () => void;
}

const { Text } = Typography

const AddMoneyToWallet = (props: AddMoneyToWalletPropsI) => {
  const message = useMessage()
  const { data: learner } = Learner.Queries.useGetLearnerDetails()
  const [form] = Form.useForm()
  useEffect(
    () => {
      if (props.amount) form.setFieldsValue({ value: props.amount.value })
    },
    [props.amount?.value]
  )
  const { addMoney, isLoading } = useCreateWallterOrder()
  const onSubmit = (data: { value: number }) => {
    if (data.value === 0) {
      return
    }
    const amount = { value: data.value, unit: Constants.DEFAULT_CURRENCY }
    addMoney({
      amount: amount,
      onSuccess: () => {
        message.open({
          type: 'success',
          content: `Recharge of ${Utils.UnitTypeToStr(amount)} was successful`,
          particle: true
        })
        props.onSucces && props.onSucces()
        props.closeModal && props.closeModal()
      }
    })
  }
  return (
    <Row justify={'center'} align={'middle'}>
      <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
        <CoinImage width={50} />
      </Col>
      <Col span={24}>
        <Form onFinish={onSubmit} layout="vertical" form={form}>
          <Form.Item
            name="value"
            label="Add money"
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
                <Input placeholder="Enter recharge amount" type="number" />
              </Col>
            </Row>
          </Form.Item>
          <Button
            loading={isLoading}
            onClick={form.submit}
            block
            type="primary"
          >
            Add Money
          </Button>
        </Form>
      </Col>
    </Row>
  )
}

export default AddMoneyToWallet

export const useCreateWallterOrder = () => {
  const message = useMessage()
  const {
    mutate: createOrder,
    isLoading: creatingWalletOrder
  } = Learner.Queries.useCreateWalletOrder()
  const {
    mutate: updatePaymentOrder,
    isLoading: updatingPaymentOrder
  } = Learner.Queries.useUpdateOrderStatus()
  const { openCheckout } = usePaymentCheckout()

  const addMoney = ({
    amount,
    onSuccess
  }: {
    amount: Types.ValueUnitType,
    onSuccess: Function
  }) => {
    createOrder(
      {
        data: {
          value: amount.value,
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
                  onSuccess && onSuccess()
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
                onSuccess: () => onSuccess && onSuccess()
              }
            )
          })
        }
      }
    )
  }

  return {
    addMoney,
    isLoading: creatingWalletOrder || updatingPaymentOrder
  }
}
