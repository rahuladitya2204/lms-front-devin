import { Button, Col, Form, Input, Row, message } from "@Lib/index";

import AffiliateDashboard from "./AffiliateDashboard";
import AppImage from "@Components/Image";
import { Learner } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";

const { Title, Text } = Typography;

export default function AffiliateForm() {
  const { mutate: becomeAffiliate, isLoading: registering } =
    Learner.Queries.useBecomeAffiliate();
  const { data: learner } = Learner.Queries.useGetLearnerDetails();
  const [form] = Form.useForm();
  const onSubmit = () => {
    becomeAffiliate(undefined, {
      onSuccess: () => {
        message.open({
          type: "success",
          content: "You have successfully enrolled for our affiliate program",
        });
      },
    });
  };
  const { isMobile } = useBreakpoint();
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Row gutter={[20, 20]} justify={"center"} align={"middle"}>
          <Col md={10} xs={0} sm={0}>
            <AppImage src="/images/affiliate.svg" />
          </Col>
          <Col xs={24} sm={24} md={14} style={{ paddingLeft: 30 }}>
            <Title>Become an affiliate</Title>
            <Title level={3}>Affiliate Program Signup</Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              Join our thriving community of affiliates and start earning today!
              As an affiliate, you'll have the opportunity to earn commissions
              by promoting our courses and tests to your network. Our program is
              designed to be simple, rewarding, and supportive, providing you
              with all the necessary tools and resources to succeed.
            </Title>

            <Title level={3}>How it Works</Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              1. Sign Up: Complete this form to join our affiliate program
            </Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              2. Promote: Use your unique referral link to promote our offerings
            </Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              3. Earn: Receive commissions for every sale made through your
              link.
            </Title>
            <Title level={3}>Benifits</Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              Attractive commission rates
            </Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              Access to promotional materials and resources
            </Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              Real-time tracking of your referrals and earnings
            </Title>
            <Title level={4} style={{ fontSize: 18, fontWeight: 400 }}>
              Dedicated support to help you maximize your potential
            </Title>
            <Button
              style={{ marginTop: 40 }}
              loading={registering}
              type="primary"
              size="large"
              onClick={onSubmit}
              block={isMobile}
            >
              Accept and Register
            </Button>
          </Col>
        </Row>
      </Col>
      {/* <Col span={24}>
        <Button
          loading={registering}
          type="primary"
          size="large"
          onClick={form.submit}
        >
          Accept and Register
        </Button>
      </Col> */}
    </Row>
  );
}
