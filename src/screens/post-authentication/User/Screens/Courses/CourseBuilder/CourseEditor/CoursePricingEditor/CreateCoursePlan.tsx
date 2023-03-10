import { Button, Col, Form, Input, Radio, Row, Select } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { Fragment, useEffect } from 'react'

import ActionModal from '@Components/ActionModal'
import { User } from '@adewaskar/lms-common'

interface CreateCoursePlanPropsI {
  children?: React.ReactNode;
  courseId: string;
  plan?: Types.Plan;
}

function CreateCoursePlan(props: CreateCoursePlanPropsI) {
  const [form] = Form.useForm()
  const {
    mutate: createCoursePlan,
    isLoading: isCreating
  } = User.Queries.useCreateCoursePlan(form.resetFields)
  const {
    mutate: updateCoursePlan,
    isLoading: isUpdating
  } = User.Queries.useUpdateCoursePlan(form.resetFields)
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
      courseId: courseId,
      data: e
    }

    if (planId) {
      updateCoursePlan({
        ...body,
        planId
      })
    } else {
      createCoursePlan(body)
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
          <Form.Item label="Plan Name" required name="name">
            <Input placeholder="Enter plan name" />
          </Form.Item>
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
              <Col>
                <Form.Item label="List Price" name={['displayPrice', 'value']}>
                  <Input
                    type="number"
                    addonBefore={
                      <Select defaultValue="rupee">
                        <Select.Option value="rupee">₹</Select.Option>
                        <Select.Option value="dollar">$</Select.Option>
                      </Select>
                    }
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Final Payable Price"
                  name={['finalPrice', 'value']}
                >
                  <Input
                    type="number"
                    addonBefore={
                      <Select defaultValue="rupee">
                        <Select.Option value="rupee">₹</Select.Option>
                        <Select.Option value="dollar">$</Select.Option>
                      </Select>
                    }
                    defaultValue="mysite"
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null}
        </Form>
      </ActionModal>
    </Fragment>
  )
}

export default CreateCoursePlan
