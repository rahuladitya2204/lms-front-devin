import { Button, Card, Checkbox, Form, Input } from 'antd'

import { SignupData } from '../../../types'
import { useFormik } from 'formik'
import useSignup from '../hooks/useSignupUser'

function SignupUser() {
  const { mutate: Signup } = useSignup()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
      //   name: ''
    },
    onSubmit: (values: SignupData) => {
      console.log(values,'vals')
      Signup({
        email: values.email,
        password: values.password,
        name: values.name
      })
    }
  })
  return (
    <Card title="Signup" style={{ width: 300 }}>
      <Form
        initialValues={{
          remember: true
        }}
        onSubmitCapture={formik.handleSubmit}
      >
        <Form.Item label="Name" name="name">
          <Input onChange={formik.handleChange} />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input onChange={formik.handleChange} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your password!'
            }
          ]}
        >
          <Input
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default SignupUser
