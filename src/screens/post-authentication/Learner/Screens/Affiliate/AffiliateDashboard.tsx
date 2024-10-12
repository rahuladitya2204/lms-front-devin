import { Card, Col, DatePicker, List, Row, Spin, Tooltip } from "antd";
import { Learner, Utils } from "@adewaskar/lms-common";

import { CommissionStatusTag } from "./CommissionStatus";
import { InfoCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import { OrderStatusTag } from "../Account/LearnerWallet/OrderStatusTag";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { AffiliateEarnings, rangePresets } from "./AffiliateScreen";
import { useState } from "react";
import { sum } from "lodash";

const { Text, Title } = Typography;

export default function AffiliateDashboard() {
  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
  const { data: affiliateDetails, isLoading: loadingDetails } =
    Learner.Queries.useGetAffiliateAccountDetails();
  const { data: affiliateOrders, isLoading: loadingOrders } =
    Learner.Queries.useGetAffiliateOrders({ dateRange: dates });

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
        <Col xs={24} sm={24} md={24}>
          <Card
            title="Affiliate Revenue"
            extra={
              <DatePicker.RangePicker
                presets={rangePresets}
                value={dates}
                onChange={setDates}
              />
            }
          >
            <List
              loading={loadingOrders}
              dataSource={affiliateOrders}
              renderItem={(order) => {
                return (
                  <List.Item
                    extra={[
                      // <CommissionStatusTag
                      //   status={order.affiliate.commission.status}
                      // />,
                      <Text strong>
                        +
                        {Utils.UnitTypeToStr({
                          value: order?.affiliate?.commissions.reduce(
                            (a, b) => a + b.amount.value,
                            0
                          ),
                          unit: order.total.unit,
                        })}{" "}
                        <Tooltip
                          title={
                            <Row>
                              {order?.affiliate?.commissions.map(
                                (commission, index) => {
                                  return (
                                    <Col span={24}>
                                      Level {commission.level} -{" "}
                                      {Utils.UnitTypeToStr(commission.amount)}
                                    </Col>
                                  );
                                }
                              )}
                            </Row>
                          }
                        >
                          <InfoCircleFilled />
                        </Tooltip>
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
          <AffiliateEarnings />
        </Col>
      </Row>
    </Spin>
  );
}
