import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space
} from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

interface CreatePromoComponentPropsI {
  children?: ReactNode;
  data?: Types.Promo;
  closeModal?: Function;
  onFinish?: (data: Types.Promo) => void;
}
const { Option } = Select

const CreatePromo: React.FC<CreatePromoComponentPropsI> = props => {
  const {
    mutate: createPromo,
    isLoading: createPromoLoading
  } = User.Queries.useCreatePromo()
  const {
    mutate: updatePromo,
    isLoading: updatePromoLoading
  } = User.Queries.useUpdatePromo()
  const { listItems: courses } = User.Queries.useGetCourses()
  const [form] = Form.useForm()

  const onSubmit = (e: Types.Promo) => {
    console.log(e, 'ee')
    if (props.data) {
      updatePromo(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createPromo(
        { data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    }
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  return (
    <Fragment>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="code" label="Promo Code" required>
          <Input placeholder="Enter promo code" />
        </Form.Item>
        <Form.Item name={'discountPercent'} label="Discount Percent" required>
          <Input
            max={100}
            min={0}
            type="number"
            placeholder="Discount Percent"
          />
        </Form.Item>
        <Space align="end">
          <Form.Item
            label="Minimum Course Value"
            name={['minCourseValue', 'unit']}
          >
            <Select style={{ width: 70 }} defaultValue="rupee">
              <Select.Option value="rupee">₹</Select.Option>
              <Select.Option value="dollar">$</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ width: 130 }} name={['minCourseValue', 'value']}>
            <Input type="number" />
          </Form.Item>
        </Space>

        <Space align="end">
          <Form.Item
            label="Maximum Discount Value"
            name={['maxDiscountValue', 'unit']}
          >
            <Select style={{ width: 70 }} defaultValue="rupee">
              <Select.Option value="rupee">₹</Select.Option>
              <Select.Option value="dollar">$</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: 130 }}
            name={['maxDiscountValue', 'value']}
          >
            <Input type="number" />
          </Form.Item>
        </Space>
        <Space align="end" direction="horizontal" size={[20, 20]}>
          <Form.Item name="startDate" label="Start Date" required>
            <DatePicker
              style={{ width: 200 }}
              onChange={e =>
                form.setFieldValue('startDate', e?.toISOString() + '')
              }
              defaultValue={dayjs(props.data?.startDate)}
            />{' '}
          </Form.Item>
          <Form.Item name="endDate" label="End Date" required>
            <DatePicker
              style={{ width: 200 }}
              onChange={e =>
                form.setFieldValue('endDate', e?.toISOString() + '')
              }
              defaultValue={dayjs(props.data?.endDate)}
            />{' '}
          </Form.Item>
        </Space>
        <Form.Item name={['max', 'count']} label="Max Use Count" required>
          <Input placeholder="Max Count for the promo code" />
        </Form.Item>
        <Form.Item name={['courses']} label="Select Courses" required>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Courses"
            optionLabelProp="label"
          >
            {courses.map(course => {
              return (
                <Option value={course.value} label={course.label}>
                  {course.label}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['instructorName', 'title'])}
      >
        Clear
      </Button>, */}
      <Button
        loading={createPromoLoading || updatePromoLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Fragment>
  )
}

export default CreatePromo
