import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

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
  const message = useMessage()
  const onSubmit = (e: Types.CreateUserPayload) => {
    if (props.data) {
      updateUser(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'User updated successfully'
            })
            props.closeModal && props.closeModal()
          },
          onError: (er: any) => {
            message.open({ type: 'error', content: er.response.data.message })
          }
        }
      )
    } else {
      createUser(e, {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'User added successfully'
          })
          props.closeModal && props.closeModal()
        },
        onError: (er: any) => {
          message.open({ type: 'error', content: er.response.data.message })
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
        rules={[{ required: true, message: 'Please enter name of the user' }]}
        name="name"
        label="Name"
        required
      >
        <Input placeholder="Name of the user" />
      </Form.Item>
      {/* <Form.Item
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
      </Form.Item> */}
      <Form.Item
        label="Mobile Number"
        name="contactNo"
        hasFeedback
        rules={[
          {
            required: true,
            message: `Please enter user's mobile number!`
          },
          {
            len: 10,
            message: 'Contact number should be 10 digits!'
          }
        ]}
      >
        <Input placeholder="Mobile Number of the learner" type="number" />
      </Form.Item>
      <Button
        loading={createUserLoading || updateUserLoading}
        key="submit"
        htmlType='submit'
        type="primary"
        // onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  )
}

export default AddUser
