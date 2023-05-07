import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  TimePicker
} from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

interface CreateLiveSessionComponentPropsI {
  children?: ReactNode;
  data?: Types.LiveSession;
  closeModal?: Function;
  onFinish?: (data: Types.LiveSession) => void;
}

const CreateLiveSession: React.FC<CreateLiveSessionComponentPropsI> = props => {
  const {
    mutate: createLiveSession,
    isLoading: createLiveSessionLoading
  } = User.Queries.useCreateLiveSession()
  const {
    mutate: updateLiveSession,
    isLoading: updateLiveSessionLoading
  } = User.Queries.useUpdateLiveSession()

  const [form] = Form.useForm()

  const onSubmit = (e: Types.CreateLiveSessionPayload) => {
    if (props.data) {
      updateLiveSession(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createLiveSession(e, {
        onSuccess: () => {
          props.closeModal && props.closeModal()
        }
      })
    }
    // onFinish && onFinish(e)
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        rules={[
          { required: true, message: 'Please enter a title of the Live Stream' }
        ]}
        name="title"
        label="Name"
        required
      >
        <Input placeholder="Enter a title for the live session" />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please enter a description of the Live Stream'
          }
        ]}
        label="Description"
        name="description"
        required
      >
        <Input.TextArea />
      </Form.Item>
      <Row gutter={[10, 10]}>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter start time for the livestream'
              }
            ]}
            name="startTime"
            label="Start Date and Time"
            required
          >
            <DatePicker showTime />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter duration of the Live Session'
              }
            ]}
            name="duration"
            label="Duration"
            required
          >
            <Input
              type="number"
              placeholder="Please enter duration in minutes"
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Access Type" name="accessType">
        <Select
          options={[
            { label: 'Learners', value: 'learners' },
            { label: 'Open for all', value: 'open' }
          ]}
        />
      </Form.Item>

      <Button
        loading={createLiveSessionLoading || updateLiveSessionLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  )
}

export default CreateLiveSession
