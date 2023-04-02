import { Button, Checkbox, Col, Form, Input, Row, Space } from 'antd'
import { NavLink, useParams } from 'react-router-dom'
import { Store, User } from '@adewaskar/lms-common'

import AuthenticationCard from '@Components/AuthenticationCard'
import Image from '@Components/Image'
import { Typography } from 'antd'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router'

function UserLoginScreen () {
  const navigate = useNavigate()
  const { organisation, fetchOrganisation } = Store.useGlobal(state => state)
  const { orgId } = useParams()
  useEffect(
    () => {
      fetchOrganisation(orgId + '')
    },
    [orgId]
  )
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
          navigate(`/user/${orgId}/dashboard/courses`)
        }
      })
    }
  })
  return (
    <Row align="middle">
      <Col span={24}>
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
                  message: 'Please enter your password!'
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
        </AuthenticationCard>
      </Col>
    </Row>
  )
}

export default UserLoginScreen
