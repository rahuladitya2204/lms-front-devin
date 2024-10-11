import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Layout,
  Row,
  Skeleton,
  Spin,
  Tag,
  TimeRangePickerProps,
  Tooltip,
} from "@Lib/index";
import { Learner, Utils } from "@adewaskar/lms-common";
import { useNavigate } from "@Router/index";

import AffiliateDashboard from "./AffiliateDashboard";
import AffiliateForm from "./AffiliateForm";
import AffiliateProducts from "./AffiliateProducts";
import CoinImage from "../Account/LearnerWallet/CoinImage";
import Header from "@Components/Header";
import LearnerHeader from "../LearnerRoot/LearnerHeader/LearnerHeader";
import Tabs from "@Components/Tabs";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";
import dayjs from "dayjs";
import { useState } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const { Title, Text } = Typography;

export default function AffiliateScreen() {
  const navigate = useNavigate();
  const { data: learner, isLoading: loadingDetails } =
    Learner.Queries.useGetLearnerDetails();
  const { data: affiliateDetails, isFetching: loadingAffiliateDetails } =
    Learner.Queries.useGetAffiliateAccountDetails({
      enabled: !!learner.affiliate,
    });
  const { isDesktop, isMobile } = useBreakpoint();
  const wallet = affiliateDetails.wallet;
  const Balance = Utils.UnitTypeToStr(wallet.balance);
  const WalletButton = (
    <Tooltip
      title={
        !wallet.balance.value
          ? "No amount available for payout"
          : `Wallet Balance: ${Balance}`
      }
    >
      <Spin spinning={loadingAffiliateDetails}>
        <Button
          style={{ paddingTop: 2, paddingLeft: 5 }}
          color="blue-inverse"
          // size={screen.isMobile?'small':'middle'}
        >
          <Row justify={"center"} align={"middle"}>
            <Col style={{ marginTop: -1 }}>
              <CoinImage width={20} />
            </Col>
            <Col>
              <Text style={{ fontSize: 16, marginLeft: 5 }} strong>
                {" "}
                {Balance}
              </Text>
            </Col>
          </Row>
        </Button>
      </Spin>
    </Tooltip>
  );

  return (
    <Spin spinning={loadingDetails}>
      <Header
        onLogoClick={() => navigate("../app/store")}
        // showBack
        showLogo
        title="Affiliate Program"
        extra={isMobile ? [] : [WalletButton]}
      >
        {isMobile ? (
          <Row
            align={"middle"}
            justify={"space-between"}
            style={{ marginBottom: 10 }}
          >
            <Col>
              <Title style={{ margin: 0 }} level={4}>
                Wallet Balance
              </Title>
            </Col>
            <Col>{WalletButton}</Col>
          </Row>
        ) : null}
        <Card style={{ minHeight: "100vh" }}>
          {loadingDetails ? (
            <Skeleton />
          ) : (
            <Tabs
              tabKey="affiliate"
              style={{ minHeight: "100vh" }}
              tabPosition={isDesktop ? "left" : "top"}
              items={
                !learner.affiliate
                  ? [
                      {
                        label: "Registration",
                        key: "register",
                        children: <AffiliateForm />,
                      },
                    ]
                  : [
                      {
                        label: "Dashboard",
                        key: "dashboard",
                        children: <AffiliateDashboard />,
                      },
                      {
                        label: "Products",
                        key: "products",
                        children: <AffiliateProducts />,
                      },
                    ]
              }
            />
          )}
        </Card>
      </Header>
    </Spin>
  );
}

interface AffiliateEarningsPropsI {}

export const AffiliateEarnings = (props: AffiliateEarningsPropsI) => {
  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
  // console.log(dates, "ddd");
  const { data: earnings } = Learner.Queries.useGetAffiliateAccountEarnings({
    dateRange: dates,
  });
  return (
    <Row>
      <Col span={24}>
        <Card
          title="Earnings"
          extra={
            <DatePicker.RangePicker
              presets={rangePresets}
              value={dates}
              onChange={setDates}
            />
          }
        >
          <div style={{ height: 600 }}>
            <ResponsiveContainer width={"100%"}>
              <LineChart
                data={earnings} // Pass the earnings data to the chart
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date">
                  <Label value="Date" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis>
                  <Label
                    value="Earnings (₹)"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
                <Tooltip
                  formatter={(value) => `₹${value}`} // Format tooltip values as Rupee currency
                  labelFormatter={(label) => `Date: ${label}`} // Show date in the tooltip
                />
                <Line
                  type="monotone"
                  dataKey="totalEarnings"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];
