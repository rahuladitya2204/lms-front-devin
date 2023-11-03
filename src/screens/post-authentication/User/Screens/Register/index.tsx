import { Button, Checkbox, Form, Input, Typography } from 'antd'

import AuthenticationCard from '@Components/AuthenticationCard'
import { NavLink } from 'react-router-dom'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { useFormik } from 'formik'

function UserRegisterScreen() {
  const { mutate: Signup, isLoading: loading } = User.Queries.useRegisterUser()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      contactNo: ''
    },
    onSubmit: (values: Types.SignupData) => {
      Signup({
        email: values.email,
        password: values.password,
        name: values.name,
        contactNo: values.contactNo
      })
    }
  })
  return (
    <AuthenticationCard title={'Register'}>
      {' '}
      <Form
        layout="vertical"
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
          <Button loading={loading} block type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Typography.Text>
            Already have an account?{' '}
            <NavLink
              to={'/login'}
              children={<Button type="link">Log In</Button>}
            />
          </Typography.Text>
        </Form.Item>
      </Form>
    </AuthenticationCard>
  )
}

export default UserRegisterScreen
