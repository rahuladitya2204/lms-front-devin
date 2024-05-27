import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Skeleton,
  Statistic,
  Tag,
} from "@Lib/index";
import {
  CloseOutlined,
  UserOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Enum, User } from "@adewaskar/lms-common";
// import UpcomingTest from './UpcomingTest'
import { Link, useNavigate, useParams } from "@Router/index";

import BackButton from "@Components/BackButton";
import Header from "@Components/Header";
// import PastTest from './PastTest'
import Tabs from "@Components/Tabs";
import TestAttendedList from "./TestAttendedList";
import TestEnrolledList from "./EnrolledList";
import { Text } from "@Components/Typography/Typography";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import { printPdf } from "@Components/Editor/SunEditor/utils";
import useBreakpoint from "@Hooks/useBreakpoint";

const { confirm } = Modal;

const TestStatus = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { isMobile } = useBreakpoint();
  const { mutate: evaluateLiveTestResult, isLoading: generatingResult } =
    User.Queries.useEvaluateLiveTestResult();
  const { mutate: sendResultViaWhatsapp } =
    User.Queries.useSendResultViaWhatsapp(testId + "");
  const { data: test, isLoading: loadingTest } = User.Queries.useGetTestDetails(
    testId + ""
  );
  const { mutate: printResults, isLoading: printingResult } =
    User.Queries.usePrintTestResult(testId + "");
  const result = test.result.metrics;
  const SkelArr = [1, 1, 1, 1, 1, 1];
  const PrintResultButton = (
    <Dropdown.Button
      // block={!!isMobile
      menu={{
        items: [
          {
            label: "Upload Answer Sheets",
            key: "upload-answer-sheet",
            onClick: () => {
              window.open(`/admin/test/${testId}/answer-sheet/upload`);
            },
          },
          {
            label: "Send Result Whatsapp",
            key: "whatsapp",
            icon: <WhatsAppOutlined />,
            onClick: () => {
              sendResultViaWhatsapp();
            },
          },
        ],
      }}
      loading={printingResult}
      onClick={() => {
        confirm({
          title: `Are you sure, you want to print the results`,
          // icon: <ExclamationCircleOutlined />,
          // content: `Money will be deducted from your wallet`,
          onOk() {
            printResults(undefined, {
              onSuccess: (s) => printPdf(s),
            });
          },
          okText: "Yes, Print",
        });
      }}
      type="primary"
    >
      Print Result
    </Dropdown.Button>
  );
  const GenerateResultButton = (
    <Button
      block={isMobile}
      onClick={() => {
        confirm({
          title: `Are you sure, you want to genarate the results`,
          // icon: <ExclamationCircleOutlined />,
          // content: `Money will be deducted from your wallet`,
          onOk() {
            evaluateLiveTestResult(testId + "");
          },
          okText: "Generate Result",
        });
      }}
      loading={generatingResult}
      type="primary"
    >
      Generate Result
    </Button>
  );
  return (
    <Header
      title={
        <span>
          <Link to={`/admin/products/test#${test.category}`}>
            <BackButton disabled={!test.category} />
          </Link>{" "}
          Tests: {test.title}
        </span>
      }
      extra={[!isMobile ? GenerateResultButton : null]}
    >
      <Row gutter={[20, 30]}>
        {result ? (
          <Col span={24}>
            {isMobile ? (
              <div style={{ marginBottom: 15 }}>{GenerateResultButton}</div>
            ) : null}
            <Card
              title={<Text>{test.title}</Text>}
              extra={<Tag>{dayjs(test.live.scheduledAt).format("LLL")}</Tag>}
            >
              {loadingTest ? (
                <Row gutter={[20, 20]}>
                  {SkelArr.map(() => (
                    <Col xs={24} md={8}>
                      <Skeleton.Button active block style={{ height: 110 }} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Row gutter={[20, 20]}>
                  <Col md={8} xs={24}>
                    <Card>
                      <Statistic
                        title="Total Students"
                        value={result.totalStudents}
                        // precision={2}
                        // valueStyle={{ color: '#3f8600' }}
                        // prefix={<UserOutlined />}
                        // suffix="%"
                      />
                    </Card>
                  </Col>

                  <Col md={8} xs={24}>
                    <Card>
                      <Statistic
                        title="Average Score"
                        value={Math.ceil(result.averageScore)}
                        // prefix={<UserOutlined />}
                      />
                    </Card>
                  </Col>

                  <Col md={8} xs={24}>
                    <Card>
                      <Statistic
                        title="Absent Students"
                        value={result.absentStudents}
                        // prefix={<CloseOutlined />}
                      />
                    </Card>
                  </Col>

                  <Col md={8} xs={24}>
                    <Card>
                      <Statistic
                        title="Finished Students"
                        value={result.completedTest}
                        // prefix={<UserOutlined />}
                      />
                    </Card>
                  </Col>

                  {test.passingScore ? (
                    <>
                      {" "}
                      <Col md={8} xs={24}>
                        <Card>
                          <Statistic
                            title="Passed Students"
                            value={result.totalPassing}
                            // prefix={<UserOutlined />}
                          />
                        </Card>
                      </Col>
                      {test.passingScore ? (
                        <Col md={8} xs={24}>
                          <Card>
                            <Statistic
                              title="Failed Students"
                              value={result.totalFailed}
                              // prefix={<UserOutlined />}
                            />
                          </Card>
                        </Col>
                      ) : null}
                    </>
                  ) : null}
                </Row>
              )}
            </Card>
          </Col>
        ) : null}
        {/* <Col span={24}>
          <Alert
            message="Exam results arent published yet"
            type="success"
            showIcon
            action={[
              <Button size="small">Publish without feedback</Button>,
              <Button type="primary" style={{ marginLeft: 20 }} size="small">
                Publish with feedback
              </Button>
            ]}
            closable
          />
        </Col> */}
        <Col span={24}>
          <Card>
            <Tabs
              tabBarExtraContent={{
                right: !isMobile ? PrintResultButton : null,
              }}
              defaultActiveKey="1"
              tabKey="test-status"
              items={[
                {
                  key: "Attended",
                  label: "Attended",
                  children: (
                    <>
                      {isMobile ? (
                        <div style={{ marginBottom: 20 }}>
                          {PrintResultButton}
                        </div>
                      ) : null}
                      <TestAttendedList />,
                    </>
                  ),
                },
                {
                  key: "Enrolled",
                  label: "Enrolled",
                  children: <TestEnrolledList />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Header>
  );
};

export default TestStatus;
