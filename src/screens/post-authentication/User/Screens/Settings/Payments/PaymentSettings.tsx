import { Button, Card, Col, Divider, Form, Input, Row, Select } from 'antd'
import { Fragment, useEffect } from 'react'
import { Types, User } from '@invinciblezealorg/lms-common'

import Header from '@Components/Header'
import { SaveOutlined } from '@ant-design/icons'
import { currencies } from './constants'
import useMessage from '@Hooks/useMessage'

const PAYMENT_GATEWAYS = [
  {
    label: 'Razorpay',
    value: 'razorpay'
  },
  {
    label: 'Stripe',
    value: 'stripe'
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

  const {
    data: { payment: paymentSetting },
    isFetching: loadingSettings
  } = User.Queries.useGetOrgSetting()
  const {
    mutate: updateOrgSetting,
    isLoading: updatingSetting
  } = User.Queries.useUpdateOrgSetting()

  useEffect(
    () => {
      console.log(paymentSetting, 121212)
      form.setFieldsValue(paymentSetting)
    },
    [paymentSetting]
  )

  const save = (e: any) => {
    console.log(e, 'epopi')
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
  // console.log(paymentSetting, 'paymentSetting')
  return (
    <Header
      title="Payments"
      extra={[
        <Fragment>
          <Button
            loading={updatingSetting}
            onClick={form.submit}
            type="primary"
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        </Fragment>
      ]}
    >
      <Card loading={loadingSettings} title="Global">
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
          <Divider>Payment Gateway</Divider>

          <Form.Item
            label="Payment Gateway"
            name={['global', 'gateway', 'id']}
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              style={{ width: 200 }}
              //   showSearch
              // defaultValue={PAYMENT_GATEWAYS}
              options={PAYMENT_GATEWAYS}
            />{' '}
          </Form.Item>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Form.Item
                label="Access Key"
                name={['global', 'gateway', 'access', 'key']}
                // rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              {' '}
              <Form.Item
                label="Access Secret"
                name={['global', 'gateway', 'access', 'secret']}
                // rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Header>
  )
}

export default PaymentSettings
