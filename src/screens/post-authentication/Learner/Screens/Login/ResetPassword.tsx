import { Button, Card, Form, Input } from 'antd'

import { Learner } from '@adewaskar/lms-common'
import React from 'react'
import { useNavigate } from '@Router/index'

const ResetPasswordForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const {
    mutate: resetPassword,
    isLoading: resettingPassword
  } = Learner.Queries.useResetPassword()
  const handleSubmit = ({
    password,
    confirmPassword
  }: {
    password: string,
    confirmPassword: string
  }) => {
    // if (password === confirmPassword) {
    console.log(password, 'vlaki')
    resetPassword(
      {
        password
      },
      {
        onSuccess: () => {
          navigate('../store')
        }
      }
    )
    // }

    // Replace with your password reset logic
    // console.log('Received values of form: ', values)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
        // height: '100vh'
      }}
    >
      <Card title="Reset Your Password" style={{ width: 300 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="password"
            label="Enter New Password"
            rules={[
              {
                required: true,
                message: 'Please input your new password!'
              },
              {
                min: 8,
                message: 'Password must be atleast 8 characters!'
              }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm New Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!')
                  )
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              loading={resettingPassword}
              type="primary"
              htmlType="submit"
              block
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ResetPasswordForm
