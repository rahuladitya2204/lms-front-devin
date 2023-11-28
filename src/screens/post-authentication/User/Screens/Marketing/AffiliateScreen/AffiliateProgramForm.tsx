import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  Typography
} from 'antd'
import { Enum, Learner, Types, User, Utils } from '@adewaskar/lms-common'

import { useEffect } from 'react'

const { Title } = Typography

export default function AffiliateProgramForm() {
  const [form] = Form.useForm()
  const {
    data: { affiliate },
    isLoading: loadingSetting
  } = User.Queries.useGetOrgSetting()
  const {
    mutate: updateOrgAccount,
    isLoading: updatingSetting
  } = User.Queries.useUpdateOrgSetting()

  useEffect(
    () => {
      form.setFieldsValue(affiliate)
    },
    [affiliate]
  )

  const onSubmit = (data: any) => {
    console.log(data, '12121')
    updateOrgAccount({
      data: {
        affiliate: data
      }
    })
  }
  const commissionType = Form.useWatch(['commission', 'type'], form)
  return (
    <Spin spinning={loadingSetting}>
      <Form
        onValuesChange={console.log}
        onFinish={onSubmit}
        form={form}
        layout="vertical"
      >
        <Row>
          <Col span={24}>
            <Title>
              Affiliate Program Form{' '}
              <Form.Item valuePropName="checked" name={['enabled']}>
                <Switch />
              </Form.Item>
            </Title>

            <Form.Item label={'Program Name'} name="programName">
              <Input />
            </Form.Item>
            <Title level={3}>Commission</Title>
            <Form.Item label="Committion Type" name={['commission', 'type']}>
              <Select
                options={[
                  { label: 'Fixed', value: Enum.CommissionType.FIXED },
                  { label: 'Percentage', value: Enum.CommissionType.PERCENTAGE }
                ]}
              />
            </Form.Item>
            {commissionType === Enum.CommissionType.FIXED ? (
              <Form.Item
                label="Fixed Amount"
                name={['commission', 'fixedAmount', 'value']}
              >
                <Input type="number" />
              </Form.Item>
            ) : null}
            {commissionType === Enum.CommissionType.PERCENTAGE ? (
              <Form.Item
                label="Percentage Based"
                name={['commission', 'percentage']}
              >
                <Input />
              </Form.Item>
            ) : null}
          </Col>
          <Col span={24}>
            <Button
              loading={updatingSetting}
              onClick={form.submit}
              type="primary"
            >
              Update Details
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  )
}
