import { Button, Col, Form, Input, Radio, Row, Select, Space } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { useEffect } from 'react'

import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

interface CreatePlanPropsI {
  product: Partial<Types.Product>;
  plan?: Types.Plan;
  closeModal?: Function;
}

function CreatePlan(props: CreatePlanPropsI) {
  const [form] = Form.useForm()
  const message = useMessage()

  const {
    mutate: createTestPlan,
    isLoading: isCreating
  } = User.Queries.useCreateProductPlan()
  const {
    mutate: updateTestPlan,
    isLoading: isUpdating
  } = User.Queries.useUpdateProductPlan()
  const planId = props?.plan?._id || ''
  const { product } = props
  useEffect(
    () => {
      form.setFieldsValue(props.plan)
    },
    [props.plan]
  )

  const onSubmit = (e: Types.Plan) => {
    form.validateFields()
    const body = {
      product: {
        id: product.id,
        type: product.type
      },
      data: e
    }

    if (planId) {
      updateTestPlan(
        {
          ...body,
          planId
        },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'Saved Plan Details'
            })
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      // @ts-ignore
      createTestPlan(body, {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved Plan Details'
          })
          form.resetFields()
          props.closeModal && props.closeModal()
        }
      })
    }
  }
  const planType = Form.useWatch('type', form)

  return (
    <Form
      initialValues={Constants.INITIAL_COURSE_PLAN_DETAILS}
      form={form}
      onFinish={onSubmit}
      layout="vertical"
    >
      {/* <Form.Item label="Plan Name" required name="name">
            <Input placeholder="Enter plan name" />
          </Form.Item> */}
      <Form.Item label="Plan Type" name="type">
        <Radio.Group>
          <Radio.Button value="free">Free</Radio.Button>
          <Radio.Button value="one-time">One Time Payment</Radio.Button>
          <Radio.Button value={'recurring'}>
            Recurring Subscription
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      {planType === 'one-time' || planType === 'recurring' ? (
        <Row gutter={[30, 30]}>
          <Col span={12}>
            <Space align="end">
              <Form.Item label="List Price" name={['displayPrice', 'unit']}>
                <Select style={{ width: 70 }} defaultValue="rupee">
                  <Select.Option value="rupee">₹</Select.Option>
                  <Select.Option value="dollar">$</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: 130 }}
                name={['displayPrice', 'value']}
              >
                <Input type="number" />
              </Form.Item>
            </Space>
          </Col>
          <Col span={12}>
            <Space align="end">
              <Form.Item label="Final Price" name={['finalPrice', 'unit']}>
                <Select style={{ width: 70 }} defaultValue="rupee">
                  <Select.Option value="rupee">₹</Select.Option>
                  <Select.Option value="dollar">$</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ width: 130 }} name={['finalPrice', 'value']}>
                <Input type="number" />
              </Form.Item>
            </Space>
          </Col>
        </Row>
      ) : null}
      <Row>
        {' '}
        <Col span={24}>
          <Button
            key="submit"
            type="primary"
            loading={isCreating || isUpdating}
            onClick={() => {
              form.submit()
            }}
          >
            {planId ? 'Update Plan' : 'Save Plan'}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default CreatePlan
