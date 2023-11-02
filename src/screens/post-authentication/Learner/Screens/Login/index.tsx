import { Button, Checkbox, Divider, Form, Input } from 'antd'
import {  GoogleOutlined } from '@ant-design/icons'
import { Learner, Store, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import AuthenticationCard from '@Components/AuthenticationCard'
import LearnerRegister from '../Register'
import Tabs from '@Components/Tabs'
import { Typography } from 'antd'
import { Utils } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import useOauth from './useOauth'
import ResetPassword from './RequestResetPassword'

function LearnerLogin () {

  const { fetchOrganisation } = Store.useGlobal(state => state)
  useEffect(() => {
    fetchOrganisation('learner')
  }, [])


  return (
    <AuthenticationCard>
      <Tabs
        items={[
          {
            label: 'Login with OTP',
            key: 'otp',
            children: (
      <OtpForm/>
            )
          },
          {
            label: 'Login with Email',
            key: 'email',
            children: (
            <EmailForm/>
            )
          }
        ]}
      />
    </AuthenticationCard>
  )
}

export default LearnerLogin


const OtpForm = () => {
  const [form] = Form.useForm();
  const message = useMessage();
  const [otpSent, setOtpSent] = useState(false);
  const [contactNo, setContactNo] = useState('');
  const { mutate: sendOtpApi,isLoading: sendingOtp} = Learner.Queries.useSendLoginOtp();
  const { mutate: verifyOtpApi,isLoading: verifyingOtp} = Learner.Queries.useVerifyLoginOtp();
  const sendOtp = async (d:{contactNo: string}) => {
    try {
      sendOtpApi(d,
        {
          onSuccess: user => {
            setOtpSent(true)          }
        }
      )
    } catch (error) {
      console.log('Otp Failed:', error)
    }
  }

  const verifyOtp = async (d: {  code: string }) => {
    console.log(form.getFieldsValue(), 'llklklkl');
    try {
      const values = await form.validateFields()
      verifyOtpApi({
        code: d.code,
        contactNo
      },
        {
          onSuccess: user => {
            message.open({
              type: 'success',
              content: `OTP Verified`
            })
          },
          onError: () => {
              message.open({
                type: 'error',
                content: `Invalid OTP`
              })
            }
        }
      )
    } catch (error) {
      console.log('Otp Failed:', error)
    }
  }
  return <>
  {otpSent?   <Form
  form={form}
  initialValues={{
    remember: true
  }}
  layout="vertical"
  onFinish={verifyOtp}
>
  <Form.Item
    label="Enter OTP"
    name="code"
    rules={[
      {
        required: true,
        message: 'Please otp sent to you number!'
      }
    ]}
  >
    <Input />
  </Form.Item>

  <Form.Item>
    <Button
      loading={verifyingOtp}
      block
      type="primary"
      htmlType="submit"
    >
      Verify OTP
    </Button>
  </Form.Item>
</Form>:   <Form onValuesChange={e=>setContactNo(e.contactNo)}
  form={form}
  initialValues={{
    remember: true
  }}
  layout="vertical"
  onFinish={sendOtp}
>
  <Form.Item
    label="Enter Mobile Number"
    name="contactNo"
    rules={[
      {
        required: true,
        message: 'Please enter your mobile number!'
      }
    ]}
  >
    <Input />
  </Form.Item>

  <Form.Item>
    <Button
      loading={sendingOtp}
      block
      type="primary"
      htmlType="submit"
    >
      Send OTP
    </Button>
  </Form.Item>
  <Form.Item style={{ textAlign: 'center' }}>
    <Typography.Text>
      Don't have an account?{' '}
      <ActionModal
        width={300}
        title="Login"
        cta={<Button type="link">Sign up?</Button>}
      >
        <LearnerRegister />
      </ActionModal>
    </Typography.Text>
  </Form.Item>
</Form>}
  </>
}

const EmailForm = () => {
  const orgName = Store.useGlobal(s => s.organisation.name);
  const learnerName = Store.useAuthentication(s => s.learner.name);
  const message = useMessage();
  const [form] = Form.useForm()
  const Google = useOauth('google')
  const {
    mutate: loginUser,
    isLoading: loading
  } = Learner.Queries.useLoginLearner();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      loginUser(
        {
          email: values.email,
          password: values.password,
          onSuccess: (user) => {
            message.open({
              type: 'success',
              // @ts-ignore
              content: `Welcome to ${orgName}, ${user.name}`
            })
          }
        },
        {
          onSuccess: user => {
            Utils.Storage.SetItem('orgId', user.organisation);
            // message.open({
            //   type: 'success',
            //   content: `Welcome to ${orgName}, ${learnerName}`
            // })
          }
        }
      )
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }
  
  return   <>
  <Form
    form={form}
    initialValues={{
      remember: true
    }}
    layout="vertical"
    onFinish={handleSubmit}
  >
    <Form.Item
      label="Email"
      name="email"
      rules={[
        {
          required: true,
          message: 'Please enter your email!'
        }
      ]}
    >
      <Input />
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
      <Input.Password />
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked">
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item>
      <Button
        loading={loading}
        block
        type="primary"
        htmlType="submit"
      >
        Submit
      </Button>
      </Form.Item>
      <Form.Item>
        <ActionModal width={300} cta={<Button 
        block>Forgot Password</Button>}>
          <ResetPassword/>
        </ActionModal>
      </Form.Item>
    <Form.Item style={{ textAlign: 'center' }}>
      <Typography.Text>
        Don't have an account?{' '}
        <ActionModal
          width={300}
          title="Login"
          cta={<Button type="link">Sign up?</Button>}
        >
          <LearnerRegister />
        </ActionModal>
      </Typography.Text>
    </Form.Item>
  </Form>

  <Divider dashed>or</Divider>

  <Button
    icon={<GoogleOutlined />}
    loading={Google.loading}
    block
    onClick={Google.openWindow}
    htmlType="submit"
  >
    Login with Google
  </Button>
</>
}