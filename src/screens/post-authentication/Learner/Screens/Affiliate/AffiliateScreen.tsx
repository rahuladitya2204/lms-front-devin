import {
  Alert,
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
  message,
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
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { sortBy } from "lodash";
import ActionModal from "@Components/ActionModal/ActionModal";
import BankDetailsForm from "./BankDetailsForm";
import ProtectedLearnerProfile from "../LearnerRoot/ProtectedLearnerProfile";

const { Title, Text } = Typography;
interface AffiliateScreenPropsI {
  closeModal?: Function;
}

export default function AffiliateScreen(props: AffiliateScreenPropsI) {
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
  const { mutate: verifyBankDetails, isLoading: verifyingBankAccount } =
    Learner.Queries.useVerifyAffiliateBankDetails();
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
                {Balance}
              </Text>
            </Col>
          </Row>
        </Button>
      </Spin>
    </Tooltip>
  );
  const EditBankAccount = (
    <ActionModal
      height={600}
      width={300}
      title="Enter Bank Details"
      cta={<Button size="small">Edit Bank Details</Button>}
    >
      <BankDetailsForm />
    </ActionModal>
  );
  return (
    <ProtectedLearnerProfile>
      <Spin spinning={loadingDetails}>
        {!affiliateDetails.bankDetails.accountName ? (
          <Alert
            action={EditBankAccount}
            message="Your bank account details is incomplete please fill"
            banner
            type="error"
            closable
          />
        ) : (
          <Alert
            action={
              affiliateDetails.bankDetails.status !== "verification_pending" ? (
                <Row>
                  <Col>{EditBankAccount}</Col>
                  <Col>
                    <Button
                      type="primary"
                      style={{ marginLeft: 10 }}
                      loading={verifyingBankAccount}
                      onClick={() => {
                        verifyBankDetails(undefined, {
                          onSuccess(data, variables, context) {
                            message.success("Bank Account Verified");
                            props.closeModal && props.closeModal();
                          },
                        });
                      }}
                      // type="primary"
                      size="small"
                    >
                      Verify Bank Account
                    </Button>
                  </Col>
                </Row>
              ) : null
            }
            message={
              affiliateDetails.bankDetails.status !== "verified"
                ? affiliateDetails.bankDetails.status === "verification_pending"
                  ? "Your bank detail is under verification"
                  : "Your bank account details are not verified yet"
                : null
            }
            banner
            type="error"
            closable
          />
        )}
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
    </ProtectedLearnerProfile>
  );
}

interface AffiliateEarningsPropsI {}

export const AffiliateEarnings = (props: AffiliateEarningsPropsI) => {
  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
  // console.log(dates, "ddd");
  const { data, isLoading } = Learner.Queries.useGetAffiliateAccountEarnings({
    dateRange: dates,
  });
  const { isMobile } = useBreakpoint();

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
          {isMobile ? (
            <Table
              loading={isLoading}
              dataSource={sortBy(data, (e) =>
                dayjs(e.date).get("seconds")
              ).reverse()}
            >
              <TableColumn
                title="Date"
                dataIndex="date"
                render={(
                  _: any,
                  record: {
                    date: string;
                    totalEarnings: number;
                  }
                ) => {
                  return dayjs(record.date).format("LL");
                }}
              />
              <TableColumn
                title="Total Earnings"
                dataIndex="totalEarnings"
                key={"totalEarnings"}
                render={(
                  _: any,
                  record: {
                    date: string;
                    totalEarnings: number;
                    totalOrders: number;
                  }
                ) => {
                  return record.totalEarnings
                    ? `₹ ${Math.ceil(record.totalEarnings)}`
                    : "-";
                }}
              />
            </Table>
          ) : (
            <div style={{ height: 600 }}>
              <ResponsiveContainer width={"100%"}>
                <LineChart
                  data={data} // Pass the earnings data to the chart
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
          )}
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
