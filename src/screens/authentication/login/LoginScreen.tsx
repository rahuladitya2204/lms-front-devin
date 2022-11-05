import { Button, Checkbox, Form, Input } from 'antd'
import { Card, Typography } from 'antd'

import AuthenticationCard from '../components/AuthenticationCard'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { useFormik } from 'formik'
import useLogin from '../hooks/useLogin'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`

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
    <AuthenticationCard title={'Login'}>
      <Form
        initialValues={{
          remember: true
        }}
        layout="vertical"
        onSubmitCapture={formik.handleSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please enter your password!'
            }
          ]}
        >
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
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Typography.Text>
            Don't have an account?{' '}
            <NavLink
              to={'/signup'}
              children={<Button type="link">Sign up?</Button>}
            />
          </Typography.Text>
        </Form.Item>
      </Form>
    </AuthenticationCard>
  )
}

export default LoginScreen
