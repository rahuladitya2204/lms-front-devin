import {
  Alert,
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  message,
} from "@Lib/index";
import {
  ArrowLeftOutlined,
  GoogleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Common,
  Constants,
  Enum,
  Learner,
  Store,
  Types,
  User,
} from "@adewaskar/lms-common";
import { Fragment, useEffect, useRef, useState } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import LearnerRegister from "../Register";
import OrgLogo from "@Components/OrgLogo";
import ResetPassword from "./RequestResetPassword";
import Tabs from "@Components/Tabs";
import { Typography } from "@Components/Typography";
import { Utils } from "@adewaskar/lms-common";
import styled from "@emotion/styled";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import useOauth from "./useOauth";
import { useParams } from "@Router/index";
import { LogEvent } from "@ServerHooks/useDehydration";

// Define breakpoints for responsive design
const breakpoints = {
  tablet: 768,
  mobile: 500,
};

// Define a media query function for convenience
const mq = (breakpoint: number) => `@media (max-width: ${breakpoint}px)`;

// Define a styled component for the AuthenticationCard
const StyledAuthenticationCard = styled.div`
  display: block;
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
  onSuccess?: Function;
  mode?: "otp" | "email";
  noImage?: boolean;
  hideSignup?: boolean;
  product?: Types.Product;
}

export function LearnerLogin(props: LearnerLoginPropsI) {
  return (
    <StyledAuthenticationCard>
      {props.mode ? (
        <>
          {props.mode === "email" ? (
            <EmailForm
              product={props.product}
              hideSignup={props.hideSignup}
              noImage
              onSuccess={props.onSuccess}
              closeModal={props.closeModal}
            />
          ) : (
            <OtpForm
              product={props.product}
              noImage
              hideSignup={props.hideSignup}
              onSuccess={props.onSuccess}
              closeModal={props.closeModal}
            />
          )}
        </>
      ) : (
        <Tabs
          tabKey={"Login"}
          centered
          items={[
            {
              label: "Login with OTP",
              key: "otp",
              children: (
                <OtpForm
                  product={props.product}
                  onSuccess={props.onSuccess}
                  hideSignup={props.hideSignup}
                  closeModal={props.closeModal}
                />
              ),
            },
            // {
            //   label: "Login with Email",
            //   key: "email",
            //   children: (
            //     <EmailForm
            //       product={props.product}
            //       onSuccess={props.onSuccess}
            //       hideSignup={props.hideSignup}
            //       closeModal={props.closeModal}
            //     />
            //   ),
            // },
          ]}
        />
      )}
    </StyledAuthenticationCard>
  );
}

export default LearnerLogin;

const OtpForm = (props: LearnerLoginPropsI) => {
  const [form] = Form.useForm();
  // const setIsSignedin = Store.useAuthentication(s => s.setIsSignedin);
  const [otpSent, setOtpSent] = useState(false);
  const { mutate: sendOtpApi, isLoading: sendingOtp } =
    Learner.Queries.useSendLoginOtp();
  const { mutate: verifyOtpApi, isLoading: verifyingOtp } =
    Learner.Queries.useVerifyLoginOtp();
  const [contactNo, setContactNo] = useState("");
  const { data: org } = Learner.Queries.useGetOrgDetails();
  const [showRegister, setShowRegister] = useState(false);
  const sendOtp = async (contactNo = "") => {
    setContactNo(contactNo);
    try {
      LogEvent("User", "Send OTP::Clicked", contactNo, {
        contactNo,
      });
      console.log(contactNo, "lkllk");
      sendOtpApi(
        { contactNo, product: props.product },
        {
          onSuccess: (user) => {
            LogEvent("User", "OTP::Sent", contactNo, {
              contactNo,
            });
            message.open({
              type: "success",
              content: `OTP has been sent to ${contactNo}`,
            });
            setContactNo(contactNo);
            setOtpSent(true);
          },
          onError: (e: any) => {
            message.open({ type: "error", content: e.response.data.message });
          },
        }
      );
    } catch (error) {
      console.log("Otp Failed:", error);
    }
  };

  const verifyOtp = async (d: { code: string }) => {
    try {
      const values = await form.validateFields();
      // let contactNo = contactNo;
      console.log(contactNo, "con");

      verifyOtpApi(
        {
          code: d.code,
          contactNo,
          onSuccess: (user: any) => {
            LogEvent("User", "OTP::Verified", contactNo, {
              contactNo,
            });
            message.open({
              type: "success",
              content: `OTP Verified, Logged in successfully`,
            });
            // setIsSignedin(true)
          },
        },
        {
          onSuccess: () => {
            props.onSuccess && props.onSuccess();
            props.closeModal && props.closeModal();
          },
          onError: (er: any) => {
            message.open({
              type: "error",
              content: er.response.data.message,
            });
          },
        }
      );
    } catch (error) {
      console.log("Otp Failed:", error);
    }
  };
  const { openModal } = useModal();
  return (
    <>
      <ActionModal
        title={`Let's get registered`}
        width={300}
        open={showRegister}
      >
        <LearnerRegister
          data={{ contactNo: contactNo }}
          onRegisterSuccess={() => setShowRegister(false)}
        />
      </ActionModal>
      {!props.noImage ? <LogoTop /> : null}
      {otpSent ? (
        <Row>
          <Col span={24}>
            <Alert
              style={{ marginBottom: 10 }}
              message={`OTP has been sent to ${contactNo}`}
              type="success"
            />
          </Col>
          <Col span={24}>
            <Form
              form={form}
              initialValues={{ remember: true }}
              layout="vertical"
              onFinish={verifyOtp}
            >
              <Button
                onClick={() => setOtpSent(false)}
                style={{ marginBottom: 10 }}
                type="link"
                size="small"
                icon={<ArrowLeftOutlined />}
              >
                Back
              </Button>
              <Form.Item
                label="Enter OTP"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please enter the OTP sent to your number!",
                  },
                  {
                    len: Constants.OTP_LENGTH,
                    message: `OTP should be ${Constants.OTP_LENGTH} digits`,
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 10 }}>
                <Button
                  loading={verifyingOtp}
                  block
                  type="primary"
                  htmlType="submit"
                >
                  Verify OTP
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  loading={sendingOtp}
                  block
                  type="default"
                  onClick={() => sendOtp(contactNo)}
                >
                  Resend OTP
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ) : (
        <Form
          form={form}
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={(e) => sendOtp(e.contactNo)}
        >
          <Form.Item
            label="Enter Mobile Number"
            name="contactNo"
            hasFeedback
            rules={[
              { required: true, message: "Please enter your mobile number!" },
              {
                len: 10,
                message: "Contact number should be 10 digits!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button loading={sendingOtp} block type="primary" htmlType="submit">
              Send OTP
            </Button>
          </Form.Item>

          {org.register.type !== Enum.LearnerRegisterType.INVITE_ONLY &&
            !props.hideSignup ? (
            <Form.Item style={{ textAlign: "center" }}>
              <Typography.Text>
                Don't have an account yet?{" "}
                <Button
                  onClick={() =>
                    openModal(
                      <LearnerRegister onRegisterSuccess={props.closeModal} />,
                      {
                        width: 300,
                        title: `Let's get signed up`,
                      }
                    )
                  }
                  type="link"
                >
                  Let's get signed up
                </Button>
              </Typography.Text>
            </Form.Item>
          ) : null}
        </Form>
      )}
    </>
  );
};

const EmailForm = (props: LearnerLoginPropsI) => {
  const [form] = Form.useForm();
  const signupButton = useRef(null);
  const [email, setEmail] = useState("");
  const { mutate: loginUser, isLoading: loading } =
    Learner.Queries.useLoginLearner();
  const {
    data: { name: orgName },
  } = Learner.Queries.useGetOrgDetails();
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      loginUser(
        {
          email: values.email,
          password: values.password,
          onSuccess: (user) => {
            Utils.Storage.SetItem("orgId", user.organisation);
            message.open({
              type: "success",
              // @ts-ignore
              content: `Welcome to ${orgName}, ${user.name}`,
              // particle: true
              // icon:<OrgLogo width={20} />
            });
          },
        },
        {
          onSuccess: () => {
            props.onSuccess && props.onSuccess();
            props.closeModal && props.closeModal();
          },
          onError: (er: any) => {
            const respMessage = er.response.data.message;
            if (respMessage.includes("not registered")) {
              message.open({
                type: "success",
                content: `Your are not yet registered, Let's Signup!`,
              });
              setEmail(values.email);
              //  @ts-ignore
              signupButton.current.click();
              return;
            }
            message.open({ type: "error", content: respMessage });
          },
        }
      );
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };
  const { openModal } = useModal();
  const { data: org } = Learner.Queries.useGetOrgDetails();
  return (
    <>
      {!props.noImage ? <LogoTop /> : null}
      <Form
        form={form}
        initialValues={{
          remember: true,
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
              message: "Please enter your email!",
            },
            {
              message: "Please enter valid email!",
              type: "email",
            },
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
              message: "Please enter your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button loading={loading} block type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              openModal(<ResetPassword />, {
                width: 300,
              });
            }}
            block
          >
            Forgot Password
          </Button>
          {/* <ActionModal width={300} cta={<Button 
        block>Forgot Password</Button>}>
          <ResetPassword/>
        </ActionModal> */}
        </Form.Item>
        {org.register.type !== Enum.LearnerRegisterType.INVITE_ONLY ? (
          <Form.Item style={{ textAlign: "center" }}>
            <Typography.Text>
              Don't have an account yet?{" "}
              <Button
                onClick={() => {
                  openModal(
                    <LearnerRegister
                      data={{ email }}
                      onRegisterSuccess={props.closeModal}
                    />,
                    {
                      width: 300,
                      title: `Let's get signed up`,
                    }
                  );
                }}
                ref={signupButton}
                type="link"
              >
                Let's get signed up
              </Button>
              {/* <ActionModal
          width={300}
          title="Let's get signed up"
          cta={<Button ref={signupButton} type="link">Let's get signed up</Button>}
        >
                <LearnerRegister data={{email}} onRegisterSuccess={props.closeModal} />
        </ActionModal> */}
            </Typography.Text>
          </Form.Item>
        ) : null}
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
  );
};

const LogoTop = () => {
  return (
    <Space
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 30,
        marginTop: 20,
      }}
    >
      <OrgLogo width={100} />
    </Space>
  );
};
