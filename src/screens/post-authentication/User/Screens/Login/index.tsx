import { Alert, Button, Card, Checkbox, Col, Divider, Form, Image, Input, Row } from 'antd'
import { ArrowLeftOutlined, ContactsFilled, GoogleOutlined } from '@ant-design/icons'
import { Constants, Store, User } from '@adewaskar/lms-common'
import { NavLink, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import AuthenticationCard from '@Components/AuthenticationCard'
import SelectFormGroup from '@Components/SelectFormGroup'
import Tabs from '@Components/Tabs'
import { Typography } from '@Components/Typography'
import UserRegister from '../Register'
import { Utils } from '@adewaskar/lms-common'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useNavigate } from 'react-router'
import useOauth from './useOauth'

function UserLogin () {
  const { isTablet, isMobile } = useBreakpoint();
  const { data: org} = User.Queries.useGetOrgDetails();
  return ( <Row style={{ minHeight: '100vh' }}>
  <Col
    style={{
      backgroundColor: 'rgb(246 246 246)',
      display: ((isTablet || isMobile)?'none':'flex'),
      justifyContent: 'center',
      alignItems: 'center'
    }}
      // span={14} 
      lg={14} // Visible on large screens
      md={{ span: 0 }}
      sm={{ span: 0 }}
      xs={{ span: 0 }}
  >
    <Image preview={false} width={'90%'} src={org.branding.logo.high.url} />
  </Col>
  <Col
    span={24}
    flex={1}
    style={{
      backgroundColor: '#FEFBF4',
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center'
    }}
  >
    <Row align={'middle'}>
      <Col
        span={24}
        flex={1}
        style={{ justifyContent: 'center', display: 'flex' }}
      >
        <Card style={{ width: 350 }}>
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
        </Card>
      </Col>
    </Row>
  </Col>
</Row>

  )
}

export default UserLogin


const OtpForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const message = useMessage();
  const [otpSent, setOtpSent] = useState(false);
  const [contactNo, setContactNo] = useState('');
  const { mutate: sendOtpApi,isLoading: sendingOtp} = User.Queries.useSendLoginOtp();
  const { mutate: verifyOtpApi, isLoading: verifyingOtp } = User.Queries.useVerifyLoginOtp();
  // const fullContactNo = contactNo;
  const sendOtp = async ({contactNo: fullContactNo}:any) => {
    setContactNo(fullContactNo)
    try {
      sendOtpApi({
        contactNo:fullContactNo,
      },
        {
          onSuccess: user => {
            console.log('generated')
            message.open({
              type: 'success',
              content:`OTP has been sent to ${fullContactNo}`
            })
            setOtpSent(true);
          },
          onError: (e) => {
            console.log('errr', e);
            message.open({
              type: 'error',
              content: 'User not found'
            })
          }
        }
      )
    } catch (error) {
      console.log('Otp Failed:', error)
    }
  }

  const verifyOtp = async (d: {  code: string }) => {
    console.log(form.getFieldsValue(), 'llklklkl');
    try {
      // const values = await form.validateFields()
      verifyOtpApi({
        code: d.code,
        contactNo: contactNo,
        // countryCode: otp.countryCode
      },
        {
          onSuccess: user => {
            message.open({
              type: 'success',
              content: `OTP Verified`
            })
            navigate(`../app/products/test`)
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
  // console.log(otpData,'otp data')
  return <>
  {otpSent?   <Form
  form={form}
  initialValues={{
    remember: true
  }}
  layout="vertical"
  onFinish={verifyOtp}
    >
      <Button onClick={() => {
        setOtpSent(false);
      }} style={{marginBottom:10}} type='link' size='small' icon={<ArrowLeftOutlined/>}>Back</Button>
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
  <Alert style={{marginBottom:10}} message={`OTP has been sent to ${contactNo}`} type="success" />
      <Form.Item>
 
    <Button
      loading={verifyingOtp}
      block style={{marginBottom: 15}}
      type="primary"
      htmlType="submit"
    >
      Verify OTP
        </Button>
        <Button onClick={()=>sendOtp({contactNo})}
      loading={sendingOtp}
      block
    >
      Resend OTP
    </Button>
  </Form.Item>
    </Form> : <Form
  form={form}
  initialValues={{
    remember: true
  }}
  layout="vertical"
  onFinish={sendOtp}
      >
          <Form.Item
              label="Enter Mobile Number"
              name="contactNo" hasFeedback
              rules={[
                { required: true, message: 'Please enter your mobile number!' },
                {
                  len: 10,
                  message: 'Contact number should be 10 digits!'
                }
              ]}>
              <Input type='number' /></Form.Item>

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
        title="Sign up"
        cta={<Button type="link">Sign up?</Button>}
      >
        <UserRegister />
      </ActionModal>
    </Typography.Text>
  </Form.Item>
</Form>}
  </>
}

const EmailForm = () => {
  const message = useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm()
  const Google = useOauth('google')
  const {
    mutate: loginUser,
    isLoading: loading
  } = User.Queries.useLoginUser();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      loginUser(
        {
          email: values.email,
          password: values.password
        },
        {
          onSuccess: user => {
            Utils.Storage.SetItem('orgId', user.organisation)
            navigate(`../app/products/courses`)
          },
          onError: () => {
            message.open({
              type: "error",
              content: 'Please enter valid details'
            })
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
    <Form.Item style={{ textAlign: 'center' }}>
      <Typography.Text>
        Don't have an account?{' '}
        <ActionModal
          width={300}
          title="Login"
          cta={<Button type="link">Sign up?</Button>}
        >
          <UserRegister />
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