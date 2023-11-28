import { Alert, Button, Checkbox, Divider, Form, Input, Modal, Space } from 'antd'
import { ArrowLeftOutlined, GoogleOutlined, MessageOutlined } from '@ant-design/icons'
import { Common, Constants, Learner, Store, User } from '@adewaskar/lms-common'
import { Fragment, useEffect, useRef, useState } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import LearnerRegister from '../Register'
import OrgLogo from '@Components/OrgLogo'
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

interface LearnerLoginPropsI {
  closeModal?: Function;
}


function LearnerLogin (props:LearnerLoginPropsI) {
  return (
    <StyledAuthenticationCard>
      <Tabs
        items={[
          {
            label: 'Login with OTP',
            key: 'otp',
            children: (
      <OtpForm closeModal={props.closeModal} />
            )
          },
          {
            label: 'Login with Email',
            key: 'email',
            children: (
            <EmailForm closeModal={props.closeModal}/>
            )
          }
        ]}
      />
    </StyledAuthenticationCard>
  )
}

export default LearnerLogin

const OtpForm = (props:LearnerLoginPropsI) => {
  const [form] = Form.useForm();
  // const setIsSignedin = Store.useAuthentication(s => s.setIsSignedin);
  const message = useMessage();
  const [otpSent, setOtpSent] = useState(false);
  const { mutate: sendOtpApi, isLoading: sendingOtp } = Learner.Queries.useSendLoginOtp();
  const { mutate: verifyOtpApi, isLoading: verifyingOtp } = Learner.Queries.useVerifyLoginOtp();
  const [contactNo, setContactNo] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const sendOtp = async (contactNo='') => {
    setContactNo(contactNo)
    try {
      // if (!contactNo) {
      //   contactNo= (await form.validateFields()).contactNo;
      // }
      console.log(contactNo,'lkllk')
      sendOtpApi({ contactNo },
      {
        onSuccess: user => {
          message.open({ type: 'success', content: `OTP has been sent to ${contactNo}` });
          setContactNo(contactNo)
          setOtpSent(true);
        },
        onError: () => {
          setShowRegister(true)
          message.open({ type: 'success', content: 'Lets get signed up' });
        }
      });
    } catch (error) {
      console.log('Otp Failed:', error);
    }
  };

  const verifyOtp = async (d: { code: string }) => {
    try {
      const values = await form.validateFields();
      // let contactNo = contactNo;
      console.log(contactNo,'con')

      verifyOtpApi({
        code: d.code,
        contactNo,
        onSuccess: (user: any) => {
          message.open({ type: 'success', content: `OTP Verified, Logged in successfully` });
          // setIsSignedin(true)
        }
      }, {
        onSuccess: () => {
          props.closeModal && props.closeModal();
        },
        onError: (er:any) => {
          console.log(er,'er')
          message.open({
            type: 'error',
            content: er.response.data.message
          })
        }
      });
    } catch (error) {
      console.log('Otp Failed:', error);
    }
  };
  return (
    <>
      <ActionModal title={`Let's get registered`} width={300} open={showRegister} ><LearnerRegister data={{contactNo: contactNo}} onRegisterSuccess={()=>setShowRegister(false)} /></ActionModal>
      <LogoTop/>
      {otpSent ? (
        <Fragment>
              <Alert style={{marginBottom:10}} message={`OTP has been sent to ${contactNo}`} type="success" />
           <Form form={form} initialValues={{ remember: true }} layout="vertical" onFinish={verifyOtp}>
          <Button onClick={() => setOtpSent(false)} style={{ marginBottom: 10 }} type='link' size='small' icon={<ArrowLeftOutlined/>}>Back</Button>
            <Form.Item label="Enter OTP" name="code" rules={[
              {
                required: true,
                message: 'Please enter the OTP sent to your number!'
              },
              {
                len: Constants.OTP_LENGTH,
                message: `OTP should be ${Constants.OTP_LENGTH} digits`
              }
            ]}><Input type='number' /></Form.Item>
          <Form.Item>
            <Button loading={verifyingOtp} block type="primary" htmlType="submit">Verify OTP</Button>
 </Form.Item>
        </Form>
            <Button loading={sendingOtp} block type="default" onClick={()=>sendOtp(contactNo)}>Resend OTP</Button>

       </Fragment>
      ) : (
        <Form form={form} initialValues={{ remember: true }} layout="vertical" onFinish={e=>sendOtp(e.contactNo)}>
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
          <Form.Item><Button loading={sendingOtp} block type="primary" htmlType="submit">Send OTP</Button></Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Typography.Text>Don't have an account?{' '}
              <ActionModal width={300} title="Sign up" cta={<Button type="link">Sign up?</Button>}>
                <LearnerRegister onRegisterSuccess={props.closeModal} />
              </ActionModal>
            </Typography.Text>
          </Form.Item>
        </Form>
      )}
    </>
  );
};


const EmailForm = (props:LearnerLoginPropsI) => {
  const message = useMessage();
  const [form] = Form.useForm();
  const signupButton = useRef(null);
  const [email, setEmail] = useState('');
  const {
    mutate: loginUser,
    isLoading: loading
  } = Learner.Queries.useLoginLearner();
  const { data: {
    name: orgName
  } } = Learner.Queries.useGetOrgDetails();
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      loginUser(
        {
          email: values.email,
          password: values.password,
          onSuccess: (user) => {
            Utils.Storage.SetItem('orgId', user.organisation);
            message.open({
              type: 'success',
              // @ts-ignore
              content: `Welcome to ${orgName}, ${user.name}`,
              particle: true
              // icon:<OrgLogo width={20} />
            });
          }
        }, {
          onSuccess: () => {
            props.closeModal && props.closeModal();
          },
          onError: (er: any) => {
            const respMessage = er.response.data.message;
            if (respMessage.includes('not registered')) {
               message.open({ type: 'info', content: `Your are not yet registered, Let's Signup!` });
              setEmail(values.email)
                           //  @ts-ignore
 signupButton.current.click();
              return;
            }
            message.open({ type: 'error', content: respMessage });
          }
        }
      )
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }
  
  return   <>
        <LogoTop/>
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
          message: 'Please enter your email!',
        },
        {
          message: 'Please enter valid email!',
          type:'email'
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
          title="Signup"
          cta={<Button ref={signupButton} type="link">Sign up?</Button>}
        >
                <LearnerRegister data={{email}} onRegisterSuccess={props.closeModal} />
        </ActionModal>
      </Typography.Text>
    </Form.Item>
  </Form>
{/* 
  <Divider dashed>or</Divider>

  <Button
    icon={<GoogleOutlined />}
    loading={Google.loading}
    block
    onClick={Google.openWindow}
    htmlType="submit"
  >
    Login with Google
  </Button> */}
</>
}

const LogoTop = () => {
  return <Space style={{display:'flex',justifyContent:"center",marginBottom:30,marginTop:20}} >
  <OrgLogo width={100} />
  </Space>
}