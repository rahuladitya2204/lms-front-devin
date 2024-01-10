import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateUserComponentPropsI {
  children?: ReactNode;
  data?: Types.User;
  closeModal?: Function;
  onFinish?: (data: Types.User) => void;
}

const AddUser: React.FC<CreateUserComponentPropsI> = props => {
  const {
    mutate: createUser,
    isLoading: createUserLoading
  } = User.Queries.useCreateUser()
  const {
    mutate: updateUser,
    isLoading: updateUserLoading
  } = User.Queries.useUpdateUser()

  const [form] = Form.useForm()

  const onSubmit = (e: Types.CreateUserPayload) => {
    if (props.data) {
      updateUser(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createUser(e, {
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
          { required: true, message: 'Please enter name of the user' }
        ]}
        name="name"
        label="Name"
        required
      >
        <Input placeholder="Name of the user" />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please enter designation of the user'
          }
        ]}
        name="designation"
        label="Designation"
        required
      >
        <Input placeholder="Designation of the user" />
      </Form.Item>
      <Form.Item
        rules={[
          { required: true, message: 'Please enter email of the user' }
        ]}
        name="email"
        label="Email"
        required
      >
        <Input placeholder="Please enter email of the user" />
      </Form.Item>
      <Button
        loading={createUserLoading || updateUserLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  )
}

export default AddUser
