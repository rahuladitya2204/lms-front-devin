import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { NavLink, useParams } from 'react-router-dom'

import { useEffect } from 'react'
import { useFormik } from 'formik'
import { saveItemToStorage } from '../../../../../utils/storage'
import { SignupData } from '../../../../../types/Common.types'
import AuthenticationCard from '../../../../../components/AuthenticationCard'
import { useRegisterLearner } from '../../Api/queries'

function LearnerRegister() {
  const { mutate: Signup, isLoading: loading } = useRegisterLearner()
  const params = useParams()
  useEffect(
    () => {
      saveItemToStorage('orgId', params.orgId + '')
    },
    [params.orgId]
  )

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: ''
    },
    onSubmit: (values: SignupData) => {
      Signup({
        email: values.email,
        password: values.password,
        name: values.name
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

export default LearnerRegister
