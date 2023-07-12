import { Button, Card, Checkbox, Col, Divider, Form, Input, Row, Space } from 'antd'
import { NavLink, useParams } from 'react-router-dom'
import { Store, User } from '@adewaskar/lms-common'

import AuthenticationCard from '@Components/AuthenticationCard'
import { GoogleOutlined } from '@ant-design/icons'
import Image from '@Components/Image'
import { Typography } from 'antd'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import useOauth from './useOauth'

function UserLoginScreen () {
  const navigate = useNavigate()
  const { organisation, fetchOrganisation } = Store.useGlobal(state => state)
  const { orgId } = useParams()
  useEffect(() => {
    fetchOrganisation()
  }, [])
  const { mutate: loginUser, isLoading: loading } = User.Queries.useLoginUser()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      loginUser({
        email: values.email,
        password: values.password,
        onSuccess: orgId => {
          navigate(`../app/courses`)
        }
      })
    }
  })
  const Google = useOauth('google')

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}
    >
      <Card style={{ width: 300, marginTop: 80 }}>
        <AuthenticationCard title={<Image src={organisation.logo} />}>
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
                  message: 'Please enter your email!'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address!'
                }
              ]}
            >
              <Input
                onChange={formik.handleChange}
                value={formik.values.email}
              />
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
      </Card>
    </div>
  )
}

export default UserLoginScreen
