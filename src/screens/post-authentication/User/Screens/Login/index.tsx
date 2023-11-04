import { ArrowLeftOutlined, ContactsFilled, GoogleOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Divider, Form, Image, Input, Row } from 'antd'
import { Constants, Store, User } from '@adewaskar/lms-common'
import { NavLink, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import AuthenticationCard from '@Components/AuthenticationCard'
import BgImage from './image.svg'
import SelectFormGroup from '@Components/SelectFormGroup'
import Tabs from '@Components/Tabs'
import { Typography } from 'antd'
import UserRegister from '../Register'
import { Utils } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useNavigate } from 'react-router'
import useOauth from './useOauth'

function UserLogin () {
  const navigate = useNavigate()

  // const { fetchOrganisation } = Store.useGlobal(state => state);
  // const isSignedIn=Store.useAuthentication(s=>s.isSignedIn)
  // useEffect(() => {
  //   if (isSignedIn) {
      
  //   }
  //   fetchOrganisation('user')
  // }, [])
  const params = useParams()

  const [form] = Form.useForm()
  const { mutate: sendOtp} = User.Queries.useSendLoginOtp();
  const { mutate: verifyOtp} = User.Queries.useVerifyLoginOtp();


  return ( <Row style={{ minHeight: '100vh' }}>
  <Col
    style={{
      backgroundColor: '#140342',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
    span={14}
  >
    <Image preview={false} width={'90%'} src={BgImage} />
  </Col>
  <Col
    span={10}
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
  const [otpData, setOtpData] = useState({
    contactNo: '',
    countryCode: '91'
  });
  const { mutate: sendOtpApi,isLoading: sendingOtp} = User.Queries.useSendLoginOtp();
  const { mutate: verifyOtpApi, isLoading: verifyingOtp } = User.Queries.useVerifyLoginOtp();
  const fullContactNo = otpData.countryCode + otpData.contactNo;
  const sendOtp = async () => {
    try {
      sendOtpApi({
        contactNo:fullContactNo
      },
        {
          onSuccess: user => {
            setOtpSent(true);
            message.open({
              type: 'success',
              content: 'OTP has been sent'
            })
          },
          onError: () => {
            console.log('errr')
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
      const values = await form.validateFields()
      verifyOtpApi({
        code: d.code,
        contactNo: fullContactNo,
        // countryCode: otp.countryCode
      },
        {
          onSuccess: user => {
            message.open({
              type: 'success',
              content: `OTP Verified`
            })
            navigate(`../app/products/courses`)
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
  console.log(otpData,'otp data')
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

      <Form.Item>
 
    <Button
      loading={verifyingOtp}
      block style={{marginBottom: 15}}
      type="primary"
      htmlType="submit"
    >
      Verify OTP
        </Button>
        <Button onClick={sendOtp}
      loading={sendingOtp}
      block
    >
      Resend OTP
    </Button>
  </Form.Item>
    </Form> : <Form onValuesChange={e => setOtpData({
  ...otpData,
  ...e.otp
})}
  form={form}
  initialValues={{
    remember: true
  }}
  layout="vertical"
  onFinish={sendOtp}
      >
        <SelectFormGroup
          prefixValue='+91'
          prefixName={[
          'otp','countryCode'
        ]}
          name={['otp', 'contactNo']}
          prefixValues={Constants.COUNTRY_CODES.map(c => {
            return {
              label: <span>{c.code} { c.flag}</span>,
              value: c.dial_code
           }
          })}
          label='Enter Mobile Number' />

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