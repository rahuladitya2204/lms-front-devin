import useMessage from '@Hooks/useMessage'
import { Learner } from '@adewaskar/lms-common'
import { Button, Form, Input } from 'antd'

const RequestResetPassword = () => {
  const [form] = Form.useForm()
  const message = useMessage()
    const {
        mutate: requestPasswordReset,
        isLoading
    } = Learner.Queries.useRequestPasswordReset();

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
          onError: () => {
            message.open({
              type: 'error',
              content: `Failed to send password reset email`
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
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your email!',
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

export default RequestResetPassword;