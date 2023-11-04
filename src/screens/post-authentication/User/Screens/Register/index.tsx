import { Button, Checkbox, Form, Input } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import AuthenticationCard from '@Components/AuthenticationCard'
import { NavLink } from 'react-router-dom'
import React from 'react'

function UserRegisterScreen() {
  const { mutate: Signup, isLoading: loading } = User.Queries.useRegisterUser()

  const onFinish = (values: Types.SignupData) => {
    Signup(values)
  }

  return (
    <AuthenticationCard title="Register">
      <Form
        layout="vertical"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contact Number"
          name="contactNo"
          rules={[
            { required: true, message: 'Please input your contact number!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: 'email', message: 'The input is not valid E-mail!' },
            { required: true, message: 'Please input your E-mail!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button loading={loading} block type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AuthenticationCard>
  )
}

export default UserRegisterScreen
