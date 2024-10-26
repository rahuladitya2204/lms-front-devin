"use client";

import {
  AimOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  EditOutlined,
  LinkOutlined,
  LogoutOutlined,
  MenuOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Tabs as AntdTabs,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  List,
  Modal,
  Progress,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Tag,
} from "@Lib/index";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Enum, Learner, User, Utils } from "@adewaskar/lms-common";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "@Router/index";

// import ActionDrawer from '@Components/ActionDrawer'
// import ActionModal from '@Components/ActionModal/ActionModal'
import Header from "@Components/Header";
// import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import LearnerProfile from "@Learner/Screens/Account/LearnerProfile";
// import { NavLink } from '@Router/index'
import ProcessingResult from "./ProcessingResult";
import ProtectedContent from "@Components/ProtectedComponent";
import Tabs from "@Components/Tabs";
import TestLeaderboard from "./TestLeaderboard";
// import TestPlayerItemReiew from '../TestReview/TestPlayerItemReview'
import { Typography } from "@Components/Typography";
import { capitalize } from "lodash";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useQueryClient } from "@tanstack/react-query";
import ProtectedLearnerProfile from "../../../LearnerRoot/ProtectedLearnerProfile";
import {
  accumulateCountsUpToLevel,
  buildTopicHierarchy,
  initializeTopicCounts,
} from "../../../../../User/Screens/Tests/TestCreator/TestBuilder/utils";
import AddToHomeScreenBanner from "@Components/AddToHomeScreen";
import { FormatLangText } from "@Components/Editor/SunEditor/utils";
import { TEXTS } from "texts/texts";

const { confirm } = Modal;
const { Title, Text } = Typography;

interface TestMetricsPropsI {
  // testId?: string;
}

export default function TestMetrics(props: TestMetricsPropsI) {
  const navigate = useNavigate();
  const { testId } = useParams();
  const qc = useQueryClient();
  const {
    data: { topics: topicIds },
  } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.RESULT
  );
  const { data: enrolledProduct, isLoading: loadingEnrolledProduct } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: testId + "",
    });
  const language = enrolledProduct?.metadata?.test?.language || 'eng';
  // @ts-ignore
  const [selectedMainTopic, setSelectedMainTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const {
    data: { test, metrics, status, feedback, leaderboard },
    isFetching: loadingResult,
  } = Learner.Queries.useGetTestResult(testId + "");

  const { data: topics } = Learner.Queries.useGetTopics();
  const COLORS = ["#52c41a", "#FF4040", "#D3D3D3"]; // Green for correct, Red for wrong, Grey for unattempted
  const pieChartData = useMemo(() => {
    return [
      { name: (FormatLangText(TEXTS.CORRECTLY_ANSWERED, language)), value: metrics.totalCorrectlyAnswered },
      { name: (FormatLangText(TEXTS.WRONGLY_ANSWERED, language)), value: metrics.totalWronglyAnswered },
    ];
  }, [metrics]);
  useEffect(() => {
    setSelectedTopic(selectedMainTopic);
  }, [topicIds, selectedMainTopic]);

  useEffect(() => {
    setSelectedMainTopic(topicIds[0]);
  }, [topicIds]);
  // @ts-ignore
  const { data: MAIN_TOPICS } = Learner.Queries.useGetTopicTree(
    [selectedMainTopic],
    2
  );
  const difficultyLevelData = useMemo(() => {
    return metrics.difficultyLevel
      ? Object.keys(metrics.difficultyLevel).map((k) => {
        return {
          difficultyLevel: k,
          // @ts-ignore
          ...metrics.difficultyLevel[k],
        };
      })
      : [];
  }, [metrics]);
  // console.log(MAIN_TOPICS,'MAIN_TOPICS')
  // const TOPICS = Utils.buildTopicTree(
  //   topics,
  //   selectedTopic,
  //   selectedTopic !== selectedMainTopic ? 1 : 2
  // );

  const { data: TOPICS, isLoading: loadingTopicTree } =
    Learner.Queries.useGetTopicTree(
      [selectedTopic],
      selectedTopic !== selectedMainTopic ? 1 : 2
    );

  // @ts-ignore
  const accumulateTopicData = (topic, topicMap) => {
    if (!topicMap[topic._id]) {
      topicMap[topic._id] = {
        correct: 0,
        incorrect: 0,
        total: 0,
        topic: topic.title[language],
        _id: topic._id,
        parentId: topic.parentId,
      };
    }

    const topp = metrics.topics.find((t) => t.topic === topic._id);
    if (topp) {
      topicMap[topic._id].correct += topp.correct;
      topicMap[topic._id].incorrect += topp.incorrect;
      topicMap[topic._id].total += topp.total;

      if (topic.parentId && topicMap[topic.parentId]) {
        topicMap[topic.parentId].correct += topp.correct;
        topicMap[topic.parentId].incorrect += topp.incorrect;
        topicMap[topic.parentId].total += topp.total;
      }
    }

    //  @ts-ignore
    topic.children.forEach((child) => {
      accumulateTopicData(child, topicMap);
    });
  };

  // In your useMemo hook
  const topicsData = useMemo(() => {
    if (!metrics.topics) {
      return [];
    }

    const topicsById = {};
    const topicHierarchy = new Map();

    // Build mappings
    buildTopicHierarchy(TOPICS, null, topicsById, topicHierarchy);

    // Initialize counts
    const topicMap = initializeTopicCounts(topicsById);

    // Accumulate counts
    accumulateCountsUpToLevel(metrics.topics, topicHierarchy, topicMap, 2);

    // Return topics with total > 0
    return Object.values(topicMap)
      .filter((t) => t.total > 0).map(i => {
        return {
          ...i,
          topic: i.topic[language] || i.topic['eng']
        }
      });
  }, [metrics, TOPICS]);

  const { isMobile } = useBreakpoint();
  // console.log(pieChartData, 'as')
  const ViewSolutions = (
    <Button
      style={{ marginRight: isMobile ? 0 : 10 }}
      onClick={() => navigate(`/app/test/${testId}/review`)}
      type="primary"
      icon={<EditOutlined />}
    >
      View Solutions
    </Button>
  );
  const timeTaken = dayjs(enrolledProduct.metadata.test.endedAt).diff(
    dayjs(enrolledProduct.metadata.test.startedAt),
    "seconds"
  );
  const ExitButton = (
    <Button
      style={{ width: isMobile ? "100%" : 100, marginTop: 10 }}
      icon={isMobile ? <ArrowLeftOutlined /> : <LogoutOutlined />}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          // icon: <ExclamationCircleOutlined />,
          content: `You want to exit reviewing?`,
          onOk() {
            if (enrolledProduct.package) {
              navigate(
                `/app/test-series/${enrolledProduct.package}/enrolled-package`
              );
            } else {
              navigate(`/app/test/${testId}`);
            }
          },
          okText: "Yes, Exit",
        });
      }}
      type="primary"
      danger
    // loading={submittingTest}
    >
      Exit
    </Button>
  );

  // console.log(difficultyLevelData, "difficultyLevelData");
  // @ts-ignore
  const BarChartDifficultyLevel = (
    <ResponsiveContainer height={300}>
      <BarChart data={difficultyLevelData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="difficultyLevel" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="correct" stackId="a" fill="#52c41a" name="Correct" />
        <Bar dataKey="incorrect" stackId="a" fill="#f94041" name="Incorrect" />
        <Bar dataKey="total" stackId="a" fill="#ffc658" name="Total" />
      </BarChart>
    </ResponsiveContainer>
  );

  const BarChartTopics = (
    <ResponsiveContainer height={400}>
      <BarChart data={topicsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="topic" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="correct" stackId="a" fill="#52c41a" name="Correct" />
        <Bar dataKey="incorrect" stackId="a" fill="#f94041" name="Incorrect" />
        <Bar dataKey="total" stackId="a" fill="#ffc658" name="Total" />
      </BarChart>
    </ResponsiveContainer>
  );

  const PiechartComponent = (
    <>
      <Card title={FormatLangText(TEXTS.OVERALL_PERFORMANCE, language)}>
        <Row justify={"center"} align={"middle"}>
          <Col>
            <PieChart width={300} height={250}>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#52c41a"
                //   label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Col>
        </Row>
      </Card>
      {difficultyLevelData.reduce((sum, obj) => sum + obj.total, 0) ? (
        <Card style={{ marginTop: 20 }} title="Difficulty Level Report">
          {loadingResult ? (
            <Card style={{ height: 300 }}>
              <Skeleton active />
            </Card>
          ) : // @ts-ignore
            test?._id ? (
              <Row>
                <Col xs={24}>{BarChartDifficultyLevel}</Col>
              </Row>
            ) : null}
        </Card>
      ) : null}
    </>
  );
  // console.log(difficultyLevelData.reduce((sum, obj) => sum + obj.total, 0),'difficultyLevelData.reduce((a,b)=>a.total+b.total,0)')

  if (status !== Enum.TestResultStatus.EVALUATED) {
    return <ProcessingResult testId={testId + ""} />;
  }
  const questions = test.sections.map((i) => i.items).flat();
  const totalAnswered =
    metrics.totalCorrectlyAnswered + metrics.totalWronglyAnswered;
  const DROPDOWN_TOPICS = MAIN_TOPICS.filter((i) => {
    const t = Utils.buildTopicTree(topics, i._id, 1);
    const topicMap = {};
    t.forEach((topic) => {
      //  @ts-ignore
      accumulateTopicData(topic, topicMap);
    });
    //  @ts-ignore
    return Object.values(topicMap).some((topic) => topic.total > 0);
  }).map((t) => ({
    label: t.title,
    value: t._id,
  }));
  const TABS = [
    {
      label: "Analysis",
      key: "analysis",
      children: (
        <>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Row gutter={[20, 20]}>
                <Col xs={24} md={12} lg={8}>
                  {loadingResult ? (
                    <Card style={{ marginBottom: 20, textAlign: "center" }}>
                      <Skeleton active />
                    </Card>
                  ) : (
                    <Card style={{ marginBottom: 20, textAlign: "center" }}>
                      {/* @ts-ignore */}
                      {test.passingScore ? (
                        <Title level={4}>
                          Passing Score: {metrics.passingScore}
                        </Title>
                      ) : null}
                      <Title
                        style={{
                          marginBottom: 15,
                          margin: !metrics.passingScore ? 0 : "auto",
                        }}
                        level={4}
                      >
                        {FormatLangText(TEXTS.YOU_SCORED, language)}: {Math.ceil(metrics.learnerScore)} out of{" "}
                        {metrics.totalTestScore}
                      </Title>
                      {/* {metrics.passingScore? <>
                {metrics.learnerScore >= metrics.passingScore ? (
                <Alert
                  message="You have passed this test"
                  type="success"
                />
              ) : (
                <Alert
                  message="You have failed this test"
                  type="error"
                />
                  )}
                </>:null} */}
                    </Card>
                  )}
                  <Row
                    style={{ marginTop: 15, marginBottom: 15 }}
                    gutter={[30, 30]}
                  >
                    {metrics.totalCorrectlyAnswered +
                      metrics.totalWronglyAnswered ? (
                      <Col xs={24} sm={8}>
                        <Card bordered={false}>
                          <Statistic
                            title={FormatLangText(TEXTS.ACCURACY, language)}
                            value={
                              (metrics.totalCorrectlyAnswered /
                                (metrics.totalCorrectlyAnswered +
                                  metrics.totalWronglyAnswered)) *
                              100
                            }
                            precision={1}
                            valueStyle={{ fontSize: 20, color: "blue" }}
                            prefix={<AimOutlined />}
                            suffix="%"
                          />
                        </Card>
                      </Col>
                    ) : null}

                    <Col xs={24} sm={8}>
                      <Card bordered={false}>
                        <Statistic
                          title={FormatLangText(TEXTS.COMPLETED, language)}
                          value={(totalAnswered / questions.length) * 100}
                          precision={1}
                          valueStyle={{ fontSize: 20, color: "#3f8600" }}
                          prefix={<SafetyCertificateOutlined />}
                          suffix="%"
                        />
                      </Card>
                    </Col>

                    {enrolledProduct.metadata.test.startedAt ||
                      enrolledProduct.metadata.test.endedAt ? (
                      <Col xs={24} sm={8}>
                        <Card bordered={false}>
                          <Statistic
                            title={FormatLangText(TEXTS.TIME_TAKEN, language)}
                            value={Utils.formatSeconds(timeTaken)}
                            // precision={2}
                            valueStyle={{ fontSize: 20, color: "purple" }}
                            prefix={<ClockCircleOutlined />}
                          // suffix="mins"
                          />
                        </Card>
                      </Col>
                    ) : null}
                  </Row>

                  {loadingResult ? (
                    <Card style={{ height: 300 }}>
                      <Skeleton active />
                    </Card>
                  ) : !(
                    pieChartData[0].value === 0 && pieChartData[1].value === 0
                  ) ? (
                    <Row>
                      <Col xs={24}>{PiechartComponent}</Col>
                    </Row>
                  ) : null}
                </Col>
                <Col xs={24} md={12} lg={16}>
                  {loadingResult ? (
                    <Card
                      style={{
                        marginBottom: 20,
                        textAlign: "center",
                        height: 450,
                      }}
                    >
                      <Row gutter={[20, 30]}>
                        <Col span={24}>
                          <Row gutter={[20, 20]}>
                            <Col span={12}>
                              <Skeleton active />
                            </Col>
                            <Col span={12}>
                              <Skeleton active />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Divider />
                        </Col>
                        <Col span={24}>
                          <Row gutter={[20, 20]}>
                            <Col span={12}>
                              <Skeleton active />
                            </Col>
                            <Col span={12}>
                              <Skeleton active />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ) : (
                    <Row gutter={[20, 20]}>
                      <Col span={24}>
                        <Card title={FormatLangText(TEXTS.TEST_ANALYSIS_REPORT, language)}>
                          <Title level={3}>
                            {FormatLangText(TEXTS.SECTION_WISE_BREAKDOWN, language)}
                          </Title>
                          {test?.sections?.map((section) => {
                            const attemptedPercent = Math.ceil(
                              (section?.stats?.questionsAttempted /
                                section?.stats?.totalQuestions) *
                              100
                            );
                            const correctPercent = Math.ceil(
                              (section?.stats?.questionsAnsweredCorrectly /
                                section?.stats?.totalQuestions) *
                              100
                            );
                            return (
                              <Row key={section.title}>
                                {test.sections.length > 1 ? (
                                  <Col sm={24}>
                                    <Title level={5}>
                                      {capitalize(section.title)}:
                                    </Title>
                                  </Col>
                                ) : null}
                                <Col sm={24}>
                                  <Row gutter={[20, 20]}>
                                    <Col span={12}>
                                      {FormatLangText(TEXTS.ATTEMPTED, language)}{" "}
                                      {section?.stats?.questionsAttempted}/
                                      {section?.stats?.totalQuestions}
                                      <Progress
                                        format={() => ""}
                                        percent={attemptedPercent}
                                      />
                                    </Col>
                                    <Col span={12}>
                                      {FormatLangText(TEXTS.CORRECTLY_ANSWERED, language)}{" "}
                                      {
                                        section?.stats
                                          ?.questionsAnsweredCorrectly
                                      }
                                      /{section?.stats?.totalQuestions}
                                      <Progress
                                        format={() => ""}
                                        percent={correctPercent}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Divider />
                              </Row>
                            );
                          })}
                        </Card>
                      </Col>
                      {/* @ts-ignore */}
                      {test._id && DROPDOWN_TOPICS.length ? (
                        <Col span={24}>
                          <Spin spinning={loadingTopicTree}>
                            <Card
                              bodyStyle={{
                                paddingTop: topicIds.length > 1 ? 0 : "auto",
                              }}
                              title={FormatLangText(TEXTS.TOPIC_WISE_REPORT, language)}
                              extra={
                                DROPDOWN_TOPICS.length > 1 ? (
                                  <Select
                                    style={{ width: 200 }}
                                    value={selectedTopic}
                                    onChange={(e) => {
                                      // console.log(e,'setSelectedTopic(e)')
                                      setSelectedTopic(e);
                                    }}
                                    placeholder="Select Topic"
                                    options={[
                                      {
                                        label: "Overall",
                                        // @ts-ignore
                                        value: selectedMainTopic,
                                      },
                                      ...DROPDOWN_TOPICS,
                                    ]}
                                  />
                                ) : null
                              }
                            >
                              {topicIds.length > 1 ? (
                                <AntdTabs
                                  onChange={(e) => {
                                    setSelectedMainTopic(e);
                                  }}
                                  items={topicIds.map((t) => {
                                    return {
                                      label: topics.find((top) => top._id === t)
                                        ?.title[language],
                                      key: t,
                                      children: BarChartTopics,
                                    };
                                  })}
                                />
                              ) : (
                                BarChartTopics
                              )}
                            </Card>
                          </Spin>
                        </Col>
                      ) : (
                        <Skeleton.Button active block style={{ height: 400 }} />
                      )}
                      {leaderboard && leaderboard.length ? (
                        <Col span={24}>
                          <Card title="Leaderboard">
                            <TestLeaderboard />
                          </Card>
                        </Col>
                      ) : null}
                    </Row>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  if (feedback.length) {
    TABS.push({
      label: "Feedback",
      key: "feedback",
      children: (
        <>
          {feedback.length ? (
            <Col span={24}>
              <Card title="Feedback">
                <List
                  size="large"
                  // pagination={{ position, align }}
                  dataSource={feedback}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        style={{ margin: "10px 0" }}
                        description={
                          <Row gutter={[20, 20]}>
                            <Col span={24}>
                              <Space style={{ marginTop: 10 }}>
                                <Text>
                                  {item.topics.map((topic) => (
                                    <Button
                                      icon={<LinkOutlined />}
                                      size="small"
                                      style={{
                                        marginBottom: 3,
                                        cursor: "pointer",
                                      }}
                                      color="blue"
                                      onClick={() =>
                                        window.open(
                                          `https://www.google.com/search?q=${topic}`
                                        )
                                      }
                                    >
                                      {topic}
                                    </Button>
                                  ))}
                                </Text>
                              </Space>
                            </Col>
                            <Col span={24}>
                              {/* {item.questionIds.map(i => (
                                <ActionModal cta={<Button type="primary" size="small">
                                  View Question
                                </Button>}>
                                  <TestPlayerItemReiew testId={testId} questionId={i} />
                                </ActionModal>
                              ))} */}
                            </Col>
                          </Row>
                        }
                        title={<Text>{item.text}</Text>}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ) : null}
        </>
      ),
    });
  }

  return (
    <ProtectedLearnerProfile>
      <AddToHomeScreenBanner />
      <Header
        title={!isMobile ? `Test Result: ${test?.title}` : ExitButton}
        extra={
          <div style={{ marginTop: 10 }}>
            {ViewSolutions} {!isMobile ? ExitButton : null}
          </div>
        }
      >
        <Tabs tabKey="test-metrics" items={TABS} />
      </Header>
    </ProtectedLearnerProfile>
  );
}
