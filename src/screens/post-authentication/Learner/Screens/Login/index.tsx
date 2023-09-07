import { Button, Checkbox, Divider, Form, Input } from 'antd'
import { Learner, Store, User } from '@adewaskar/lms-common'
import { NavLink, useParams } from 'react-router-dom'

import AuthenticationCard from '@Components/AuthenticationCard'
import { GoogleOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { Utils } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import useOauth from './useOauth'

function LearnerLogin () {
  const navigate = useNavigate()
  const {
    mutate: loginUser,
    isLoading: loading
  } = Learner.Queries.useLoginLearner()
  const { fetchOrganisation } = Store.useGlobal(state => state)
  useEffect(() => {
    fetchOrganisation()
  }, [])
  const params = useParams()
  // useEffect(
  //   () => {
  //     Utils.Storage.SetItem('orgId', params.orgId + '')
  //   },
  //   [params.orgId]
  // )
  const Google = useOauth('google')

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      loginUser(
        {
          email: values.email,
          password: values.password
        },
        {
          onSuccess: user => {
            Utils.Storage.SetItem('orgId', user.organisation)
          }
        }
      )
    }
  })

  return (
    <AuthenticationCard>
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
              to={'register'}
              children={<Button type="link">Sign up?</Button>}
            />
          </Typography.Text>
        </Form.Item>
      </Form>
      <Divider dashed>or</Divider>

      <Button
        // style={{ marginTop: 20 }}
        icon={<GoogleOutlined />}
        loading={Google.loading}
        block
        onClick={Google.openWindow}
        htmlType="submit"
      >
        Login with Google
      </Button>
    </AuthenticationCard>
  )
}

export default LearnerLogin
