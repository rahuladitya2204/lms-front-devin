import { Button, Checkbox, Form, Input } from 'antd'
import { Card, Typography } from 'antd'

import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { useFormik } from 'formik'
import useLogin from '../hooks/useLogin'

const { Title, Paragraph, Text, Link } = Typography

function LoginScreen () {
  const { mutate: loginUser } = useLogin()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      loginUser({
        email: values.email,
        password: values.password
      })
    }
  })
  return (
    // <Container>
    <Card title="Login" style={{ width: 300 }}>
      <Form
        initialValues={{
          remember: true
        }}
        onSubmitCapture={formik.handleSubmit}
      >
        <Form.Item label="Email" name="email">
          <Input onChange={formik.handleChange} value={formik.values.email} />
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
          <Button block type="primary" htmlType="submit">
            Submit
          </Button>
          <NavLink to={'/signup'}>
            <Button
              style={{ margin: '10px 0' }}
              block
              type="primary"
              htmlType="button"
            >
              Register User
            </Button>
          </NavLink>
        </Form.Item>
      </Form>
    </Card>
    // </Container>
  )
}

export default LoginScreen
