import { Card, Col, List, Row, Spin, Tooltip } from "antd";
import { Learner, Utils } from "@adewaskar/lms-common";

import { CommissionStatusTag } from "./CommissionStatus";
import { InfoCircleOutlined } from "@ant-design/icons";
import { OrderStatusTag } from "../Account/LearnerWallet/OrderStatusTag";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { AffiliateEarnings } from "./AffiliateScreen";

const { Text, Title } = Typography;

export default function AffiliateDashboard() {
  const { data: affiliateDetails, isLoading: loadingDetails } =
    Learner.Queries.useGetAffiliateAccountDetails();
  const { data: affiliateOrders, isLoading: loadingOrders } =
    Learner.Queries.useGetAffiliateOrders();
  console.log(affiliateOrders, "affiliateDetails");
  return (
    <Spin spinning={loadingDetails}>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            title="Total Earning"
            extra={
              <Tooltip title="Total earnings till date">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <Title level={3}>
              {Utils.UnitTypeToStr(affiliateDetails.earnings.total)}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            title="Pending Earnings"
            extra={
              <Tooltip title="Earnings yet to be paid out">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <Title level={3}>
              {Utils.UnitTypeToStr(affiliateDetails.earnings.pending)}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            title="Paid Earnings"
            extra={
              <Tooltip title="Total earnings paid out">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <Title level={3}>
              {Utils.UnitTypeToStr(affiliateDetails.earnings.paidOut)}
            </Title>{" "}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            title="Next Payout Date"
            extra={
              <Tooltip title="Payout transactions will be made on this next date">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <Title level={3}>{dayjs().add(4, "day").format("LL")}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Card>
            <List
              loading={loadingOrders}
              dataSource={affiliateOrders}
              renderItem={(order) => {
                return (
                  <List.Item
                    extra={[
                      <CommissionStatusTag
                        status={order.affiliate.commission.status}
                      />,
                      <Text strong>
                        +
                        {Utils.UnitTypeToStr(order.affiliate.commission.amount)}
                      </Text>,
                    ]}
                    key={order._id}
                  >
                    <List.Item.Meta
                      // avatar={
                      //   order.transaction.type === 'wallet' ? (
                      //     <WalletTwoTone />
                      //   ) : (
                      //     <CheckCircleTwoTone />
                      //   )
                      // }
                      title={`Commission Received`}
                      description={dayjs(order.completedAt).format("LL")}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Card title="Earnings" extra={<AffiliateEarnings />}></Card>
        </Col>
      </Row>
    </Spin>
  );
}
