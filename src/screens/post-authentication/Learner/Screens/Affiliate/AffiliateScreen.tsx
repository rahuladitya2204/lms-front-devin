import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Layout,
  Row,
  Skeleton,
  Spin,
  Tag,
  TimeRangePickerProps,
  Tooltip,
  message,
} from "antd";
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
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { sortBy } from "lodash";
import ActionModal from "@Components/ActionModal/ActionModal";
import BankDetailsForm from "./BankDetailsForm";
import ProtectedLearnerProfile from "../LearnerRoot/ProtectedLearnerProfile";
import {
  AlertOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import { copyToClipboard } from "@Utils/index";

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
        <Dropdown.Button
          style={{ paddingTop: 2, paddingLeft: 5 }}
          menu={{
            items: [
              {
                label: "Copy Referral Link",
                key: "copy-referral-link",
                icon: <CopyOutlined />,
                onClick: () => {
                  copyToClipboard(
                    `${window.location.origin}/affiliate?ref=${learner.affiliate}`
                  );
                },
              },
            ],
          }}
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
        </Dropdown.Button>
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

  const AffiliateLinkButton = (
    <Button
      onClick={() => {
        copyToClipboard(
          `https:///www.testmint.ai/affiliate?ref=${learner.affiliate}`
        );
      }}
    >
      Copy Affiliate Link
    </Button>
  );

  const AlertBox = !affiliateDetails.bankDetails.accountName ? (
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
                      message.warning("Bank Account Verification Initiated");
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
  );

  return (
    <ProtectedLearnerProfile>
      <Spin spinning={loadingDetails}>
        {!isMobile ? AlertBox : null}
        <Header
          onLogoClick={() => navigate("../app/store")}
          // showBack
          showLogo
          title={
            <div>
              Affiliate Program
              {/* {AlertBox} */}
            </div>
          }
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

interface AffiliateEarningsPropsI { }

export const AffiliateEarnings = (props: AffiliateEarningsPropsI) => {
  const {
    data: { affiliate },
    isLoading: loadingSetting,
  } = Learner.Queries.useGetOrgDetails();

  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
  const { data, isLoading } = Learner.Queries.useGetAffiliateAccountEarnings({
    dateRange: dates,
  });
  const { isMobile } = useBreakpoint();

  // Get commission levels from affiliate data
  const levels = affiliate.commissionLevels.map((_, ind) => ind + 1); // Levels start from 1

  // Color function for levels
  const getColorForLevel = (level) => {
    const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff4d4f", "#52c41a"]; // More colors can be added
    return colors[level - 1] || "#000"; // Default to black if level exceeds color array length
  };

  const renderEarningsBreakdown = (record) => {
    return (
      <div>
        {levels.map((level) => (
          <div key={level}>
            <strong>Level {level}:</strong> ₹
            {record[`level_${level}_earnings`]
              ? Math.ceil(record[`level_${level}_earnings`])
              : 0}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Row>
      <Col span={24}>
        <Card
          title="Your Earnings"
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
                  record: { date: string; totalEarnings: number }
                ) => {
                  return dayjs(record.date).format("LL");
                }}
              />
              <TableColumn
                title="Total Earnings"
                dataIndex="totalEarnings"
                key={"totalEarnings"}
                render={(_: any, record: { totalEarnings: number }) => {
                  return record.totalEarnings ? (
                    <>
                      <Text strong>₹ {Math.ceil(record.totalEarnings)}</Text>{" "}
                      <Tooltip title={renderEarningsBreakdown(record)}>
                        <InfoCircleTwoTone />
                      </Tooltip>
                    </>
                  ) : (
                    "-"
                  );
                }}
              />
            </Table>
          ) : (
            <div style={{ height: 600 }}>
              <ResponsiveContainer height={700} width={"100%"}>
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

                  {/* Tooltip with formatter for custom display */}
                  <ReTooltip
                    // @ts-ignore
                    formatter={(value) => `₹${Math.ceil(value)}`} // Format tooltip values as Rupee currency
                    labelFormatter={(label) => `${dayjs(label).format("LL")}`} // Format date in the tooltip
                  />

                  {/* Dynamically render lines for each level */}
                  {levels.map((level) => (
                    <Line
                      key={level}
                      type="monotone"
                      dataKey={`level_${level}_earnings`} // Dynamic dataKey for levels
                      stroke={getColorForLevel(level)} // Assign color based on level
                      activeDot={{ r: 8 }}
                      dot={{ r: 4 }}
                      name={`Level ${level}`} // Show level name in the tooltip and legend
                    />
                  ))}

                  {/* Legend to toggle lines */}
                  <Legend verticalAlign="top" height={36} />
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
