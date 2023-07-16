import { Button, Card, Form, Input, Select, Tabs } from 'antd'
import { Fragment, useEffect } from 'react'
import { Types, User } from '@adewaskar/lms-common'

import EmailSettingScreen from '../EmailSetting/EmailSettingScreen'
import Header from '@Components/Header'
import { Outlet } from 'react-router'
import { SaveOutlined } from '@ant-design/icons'
import TicketCategorysScreen from '../SupportTickets/TicketCategoriesScreen'
import { currencies } from './constants'
import useMessage from '@Hooks/useMessage'

const PAYMENT_GATEWAYS = [
  {
    label: 'Razorpay',
    value: 'razorpay'
  }
]

const TAXES_APPLICABLE = [
  {
    label: 'GST',
    value: 'gst'
  }
]

function PaymentSettings() {
  const [form] = Form.useForm()
  const message = useMessage()

  const { data: { payment: paymentSetting } } = User.Queries.useGetOrgSetting()
  const { mutate: updateOrgSetting } = User.Queries.useUpdateOrgSetting()

  useEffect(
    () => {
      form.setFieldsValue(paymentSetting)
    },
    [paymentSetting]
  )

  const save = (e: any) => {
    console.log(e, 'sss')
    updateOrgSetting(
      {
        data: {
          payment: e
        }
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved'
          })
        }
      }
    )
  }
  console.log(paymentSetting, 'paymentSetting')
  return (
    <Header
      title="Payments"
      extra={[
        <Fragment>
          <Button onClick={form.submit} type="primary" icon={<SaveOutlined />}>
            Save
          </Button>
        </Fragment>
      ]}
    >
      <Card title="Global">
        <Form onFinish={save} layout="vertical" form={form} autoComplete="off">
          <Form.Item label="Currency" name={['global', 'currency']}>
            <Select
              showSearch
              style={{ width: 200 }}
              options={currencies.map(c => {
                return {
                  value: c.value,
                  label: `${c.label}(${c.symbol})`
                }
              })}
            />{' '}
          </Form.Item>

          <Form.Item
            label="Tax Applicable"
            name={['global', 'tax', 'type']}
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              style={{ width: 200 }}
              showSearch
              options={TAXES_APPLICABLE}
            />
          </Form.Item>
          <Form.Item
            label="Tax Rate"
            name={['global', 'tax', 'rate']}
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Payment Gateway"
            name={['global', 'gateway']}
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              style={{ width: 200 }}
              //   showSearch
              defaultValue={'razorpay'}
              options={PAYMENT_GATEWAYS}
            />{' '}
          </Form.Item>
        </Form>
      </Card>
    </Header>
  )
}

export default PaymentSettings
