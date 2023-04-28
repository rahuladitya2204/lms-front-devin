import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateInstructorComponentPropsI {
  children?: ReactNode;
  data?: Types.Instructor;
  closeModal?: Function;
  onFinish?: (data: Types.Instructor) => void;
}

const AddInstructor: React.FC<CreateInstructorComponentPropsI> = props => {
  const {
    mutate: createInstructor,
    isLoading: createInstructorLoading
  } = User.Queries.useCreateInstructor()
  const {
    mutate: updateInstructor,
    isLoading: updateInstructorLoading
  } = User.Queries.useUpdateInstructor()

  const [form] = Form.useForm()

  const onSubmit = (e: Types.CreateInstructorPayload) => {
    if (props.data) {
      updateInstructor(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createInstructor(e, {
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
          { required: true, message: 'Please enter name of the instructor' }
        ]}
        name="name"
        label="Name"
        required
      >
        <Input placeholder="Name of the instructor" />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please enter designation of the instructor'
          }
        ]}
        name="designation"
        label="Designation"
        required
      >
        <Input placeholder="Designation of the instructor" />
      </Form.Item>
      <Form.Item
        rules={[
          { required: true, message: 'Please enter email of the instructor' }
        ]}
        name="email"
        label="Email"
        required
      >
        <Input placeholder="Please enter email of the instructor" />
      </Form.Item>
      <Button
        loading={createInstructorLoading || updateInstructorLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  )
}

export default AddInstructor
