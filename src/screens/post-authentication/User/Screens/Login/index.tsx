import { Button, Checkbox, Form, Input } from 'antd'

import { NavLink } from 'react-router-dom'
import { Typography } from 'antd'
import { useFormik } from 'formik'
import { useLoginUser } from '@User/Api/queries'
import AuthenticationCard from '@Components/AuthenticationCard'

function UserLoginScreen () {
  const { mutate: loginUser, isLoading: loading } = useLoginUser()
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
    <AuthenticationCard title={'User Login'}>
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
          <Button loading={loading} block type="primary" htmlType="submit">
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

export default UserLoginScreen
