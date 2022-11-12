import { Button, Col, Form, Input, Modal, Radio, Row, Select, Tabs } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { Course, CourseSectionItem, Plan } from '@Types/Courses.types'
import ActionModal from '@Components/ActionModal'
import { useCreateCoursePlan, useUpdateCoursePlan } from '@User/Api/queries'
import { Option } from 'antd/lib/mentions'
import { INITIAL_COURSE_PLAN_DETAILS } from '@Learner/Api/queries'

interface CreateCoursePlanPropsI {
  children?: React.ReactNode;
  courseId: string;
  plan?: Plan;
}

function CreateCoursePlan(props: CreateCoursePlanPropsI) {
  const [form] = Form.useForm()
  const {
    mutate: createCoursePlan,
    isLoading: isCreating
  } = useCreateCoursePlan(form.resetFields)
  const {
    mutate: updateCoursePlan,
    isLoading: isUpdating
  } = useUpdateCoursePlan(form.resetFields)
  const planId = props?.plan?._id || ''
  const courseId = props.courseId || ''
  useEffect(
    () => {
      console.log(props.plan, 'ha')
      form.setFieldsValue(props.plan)
    },
    [props.plan]
  )

  const onSubmit = (e: Plan) => {
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
          <Button key="back" onClick={() => form.resetFields()}>
            Clear
          </Button>,
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
          initialValues={INITIAL_COURSE_PLAN_DETAILS}
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
                <Form.Item label="List Price" name={['listPrice', 'value']}>
                  <Input
                    type="number"
                    addonBefore={
                      <Select defaultValue="rupee">
                        <Option value="rupee">₹</Option>
                        <Option value="dollar">$</Option>
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
                        <Option value="rupee">₹</Option>
                        <Option value="dollar">$</Option>
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
