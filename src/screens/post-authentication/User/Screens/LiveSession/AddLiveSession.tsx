import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateLiveSessionComponentPropsI {
  children?: ReactNode;
  data?: Types.LiveSession;
  closeModal?: Function;
  onFinish?: (data: Types.LiveSession) => void;
}

const AddLiveSession: React.FC<CreateLiveSessionComponentPropsI> = props => {
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
          { required: true, message: 'Please enter name of the LiveSession' }
        ]}
        name="name"
        label="Name"
        required
      >
        <Input placeholder="Name of the LiveSession" />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please enter designation of the LiveSession'
          }
        ]}
        name="designation"
        label="Designation"
        required
      >
        <Input placeholder="Designation of the LiveSession" />
      </Form.Item>
      <Form.Item
        rules={[
          { required: true, message: 'Please enter email of the LiveSession' }
        ]}
        name="email"
        label="Email"
        required
      >
        <Input placeholder="Please enter email of the LiveSession" />
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

export default AddLiveSession
