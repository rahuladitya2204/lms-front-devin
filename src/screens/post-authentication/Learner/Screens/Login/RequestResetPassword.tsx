import { Button, Form, Input } from 'antd'

import { Learner } from '@invinciblezealorg/lms-common'
import useMessage from '@Hooks/useMessage'

const RequestResetPassword = () => {
  const [form] = Form.useForm()
  const message = useMessage()
  const {
    mutate: requestPasswordReset,
    isLoading
  } = Learner.Queries.useRequestPasswordReset()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      requestPasswordReset(
        { email: values.email },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: `Password reset email sent to ${values.email}`
            })
          },
          onError: (er: any) => {
            message.open({
              type: 'error',
              content: er.response.data.message
            })
          }
        }
      )
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Email"
        hasFeedback
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your email!'
          },
          {
            message: 'Please enter valid email!',
            type: 'email'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button loading={isLoading} block type="primary" htmlType="submit">
          Request Password Change
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RequestResetPassword
