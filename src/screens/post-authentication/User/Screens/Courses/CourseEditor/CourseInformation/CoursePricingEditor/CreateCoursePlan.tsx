import { Button, Col, Form, Input, Radio, Row, Select, Space } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { Fragment, useEffect } from 'react'

import ActionModal from '@Components/ActionModal'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

interface CreateCoursePlanPropsI {
  children?: React.ReactNode;
  courseId: string;
  plan?: Types.Plan;
  closeModal?: Function;
}

function CreateCoursePlan(props: CreateCoursePlanPropsI) {
  const [form] = Form.useForm()
  const message = useMessage()

  const {
    mutate: createProductPlan,
    isLoading: isCreating
  } = User.Queries.useCreateProductPlan()
  const {
    mutate: updateCoursePlan,
    isLoading: isUpdating
  } = User.Queries.useUpdateProductPlan()
  const planId = props?.plan?._id || ''
  const courseId = props.courseId || ''
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
        id: courseId,
        type: 'course'
      },
      data: e
    }

    if (planId) {
      updateCoursePlan(
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
            form.resetFields();
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createProductPlan(body, {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved Plan Details'
          })
          props.closeModal && props.closeModal()
        }
      })
    }
  }
  const planType = Form.useWatch('type', form)

  return (
    <Fragment>
      <ActionModal
        footer={closeModal => [
          // <Button key="back" onClick={() => form.resetFields()}>
          //   C
          // </Button>,
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
        ]}
        title="Create Plan"
        cta={props.children}
      >
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
                  <Form.Item
                    style={{ width: 130 }}
                    name={['finalPrice', 'value']}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Space>
              </Col>
            </Row>
          ) : null}
        </Form>
      </ActionModal>
    </Fragment>
  )
}

export default CreateCoursePlan
