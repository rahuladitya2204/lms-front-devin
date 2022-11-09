import { Button, Checkbox, Form, Input } from 'antd'
import { NavLink, useParams } from 'react-router-dom'

import { Typography } from 'antd'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import { saveItemToStorage } from '../../../../../utils/storage'
import AuthenticationCard from '../../../../../components/AuthenticationCard'
import { useLoginLearner } from '../../Api/queries'

function LearnerLogin () {
  const { mutate: loginUser, isLoading: loading } = useLoginLearner()

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
    <AuthenticationCard title={'Learner Login'}>
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
              to={'signup'}
              children={<Button type="link">Sign up?</Button>}
            />
          </Typography.Text>
        </Form.Item>
      </Form>
    </AuthenticationCard>
  )
}

export default LearnerLogin
