import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons'
import { Button, Checkbox, Divider, Form, Input } from 'antd'
import { Common, Constants, Learner, Store, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import LearnerRegister from '../Register'
import ResetPassword from './RequestResetPassword'
import Tabs from '@Components/Tabs'
import { Typography } from 'antd'
import { Utils } from '@adewaskar/lms-common'
import styled from '@emotion/styled';
import useMessage from '@Hooks/useMessage'
import useOauth from './useOauth';

// Define breakpoints for responsive design
const breakpoints = {
  tablet: 768,
  mobile: 500
};

// Define a media query function for convenience
const mq = (breakpoint:number) => `@media (max-width: ${breakpoint}px)`;

// Define a styled component for the AuthenticationCard
const StyledAuthenticationCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px; // This can be whatever max width you want for larger screens
  margin: 0 auto; // This centers the card horizontally

  // Apply a media query for tablet devices
  ${mq(breakpoints.tablet)} {
    max-width: 500px;
  }

  // Apply a media query for mobile devices
  ${mq(breakpoints.mobile)} {
    width: 100%;
    box-shadow: none; // Assuming you want to remove the shadow on mobile
  }
`;


function LearnerLogin () {

  const { fetchOrganisation } = Store.useGlobal(state => state)
  useEffect(() => {
    fetchOrganisation('learner')
  }, [])


  return (
    <StyledAuthenticationCard>
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
    </StyledAuthenticationCard>
  )
}

export default LearnerLogin

const OtpForm = () => {
  const [form] = Form.useForm();
  const message = useMessage();
  const [otpSent, setOtpSent] = useState(false);
  const { mutate: sendOtpApi, isLoading: sendingOtp } = Learner.Queries.useSendLoginOtp();
  const { mutate: verifyOtpApi, isLoading: verifyingOtp } = Learner.Queries.useVerifyLoginOtp();

  const sendOtp = async () => {
    try {
      const values = await form.validateFields();
      let contactNo = values.contactNo;

      sendOtpApi({ contactNo },
      {
        onSuccess: user => {
          message.open({ type: 'success', content: `OTP has been sent to ${contactNo}` });
          setOtpSent(true);
        },
        onError: () => {
          message.open({ type: 'error', content: 'Mobile Number not registered with us, Please Register by clicking on Signup' });
        }
      });
    } catch (error) {
      console.log('Otp Failed:', error);
    }
  };

  const verifyOtp = async (d: { code: string }) => {
    try {
      const values = await form.validateFields();
      let contactNo = values.contactNo;

      // Same logic for appending '+91' if necessary
      if (contactNo.replace(/\D/g, '').length === 10) {
        contactNo = '+91' + contactNo;
      }

      verifyOtpApi({
        code: d.code,
        contactNo
      },
      {
        onSuccess: user => {
          message.open({ type: 'success', content: 'OTP Verified' });
        },
        onError: () => {
          message.open({ type: 'error', content: 'Invalid OTP' });
        }
      });
    } catch (error) {
      console.log('Otp Failed:', error);
    }
  };

  return (
    <>
      {otpSent ? (
        <Form form={form} initialValues={{ remember: true }} layout="vertical" onFinish={verifyOtp}>
          <Button onClick={() => setOtpSent(false)} style={{ marginBottom: 10 }} type='link' size='small' icon={<ArrowLeftOutlined/>}>Back</Button>
          <Form.Item label="Enter OTP" name="code" rules={[{ required: true, message: 'Please enter the OTP sent to your number!' }]}><Input /></Form.Item>
          <Form.Item><Button loading={verifyingOtp} block type="primary" htmlType="submit">Verify OTP</Button></Form.Item>
        </Form>
      ) : (
        <Form form={form} initialValues={{ remember: true }} layout="vertical" onFinish={sendOtp}>
          <Form.Item label="Enter Mobile Number" name="contactNo" rules={[{ required: true, message: 'Please enter your mobile number!' }]}><Input /></Form.Item>
          <Form.Item><Button loading={sendingOtp} block type="primary" htmlType="submit">Send OTP</Button></Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Typography.Text>Don't have an account?{' '}
              <ActionModal width={300} title="Sign up" cta={<Button type="link">Sign up?</Button>}>
                <LearnerRegister />
              </ActionModal>
            </Typography.Text>
          </Form.Item>
        </Form>
      )}
    </>
  );
};


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
  const { data: org } = Common.Queries.useGetOrgDetails();
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
              content: `Welcome to ${orgName}, ${user.name}`,
              // icon:<OrgLogo width={20} />
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