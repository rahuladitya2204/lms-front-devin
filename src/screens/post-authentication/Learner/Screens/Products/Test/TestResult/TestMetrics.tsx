import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  List,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Tag
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  LinkOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined
} from '@ant-design/icons'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Enum, Learner } from '@adewaskar/lms-common'
import { useNavigate, useParams } from 'react-router'

import ActionDrawer from '@Components/ActionDrawer'
import ActionModal from '@Components/ActionModal/ActionModal'
import Header from '@Components/Header'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import LearnerProfile from '@Learner/Screens/Account/LearnerProfile'
import { NavLink } from 'react-router-dom'
import ProcessingResult from './ProcessingResult'
import ProtectedContent from '@Components/ProtectedComponent'
import Tabs from '@Components/Tabs'
import TestLeaderboard from './TestLeaderboard'
import TestPlayerItemReiew from '../TestReview/TestPlayerItemReview'
import { Typography } from '@Components/Typography'
import { capitalize } from 'lodash'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useMemo } from 'react'

const { confirm } = Modal
const { Title, Text } = Typography

export default function TestMetrics() {
  const navigate = useNavigate()
  const { testId } = useParams()
  const {
    data: { test, metrics, status, feedback, leaderboard },
    isFetching: loadingResult
  } = Learner.Queries.useGetTestResult(testId + '')
  const { data: learner } = Learner.Queries.useGetLearnerDetails()
  const COLORS = ['#52c41a', '#FF4040', '#D3D3D3'] // Green for correct, Red for wrong, Grey for unattempted
  const pieChartData = useMemo(
    () => {
      return [
        { name: 'Correctly Answered', value: metrics.totalCorrectlyAnswered },
        { name: 'Wrongly Answered', value: metrics.totalWronglyAnswered }
      ]
    },
    [metrics]
  )
  const {
    data: enrolledProduct,isLoading: loadingEnrolledProduct
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const { isMobile } = useBreakpoint()
  // console.log(pieChartData, 'as')
  const ViewSolutions = (
    <Button
      style={{ marginRight: isMobile?0:10 }}
      onClick={() => navigate(`/app/test/${testId}/result/review`)}
      type="primary"
      icon={<EditOutlined />}
    >
      View Solutions
    </Button>
  )
  const ExitButton = (
    <Button
      style={{ width: isMobile ? '100%' : 100 }}
      icon={isMobile?<ArrowLeftOutlined/>:<LogoutOutlined />}
      onClick={() => {
        confirm({
          title: 'Are you sure?',
          // icon: <ExclamationCircleOutlined />,
          content: `You want to exit reviewing?`,
          onOk() {
            if (enrolledProduct.package) {
              navigate(`/app/package/${enrolledProduct.package}/enrolled-package`)
            }
            else {
              navigate(`/app/test/${testId}`)
            }          },
          okText: 'Yes, Exit'
        })
      }}
      type="primary"
      danger
      // loading={submittingTest}
    >
      Exit
    </Button>
  )
  const PiechartComponent = (
    <Card title="Overall Performance">
      <Row justify={'center'} align={'middle'}>
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
  )

  if (status !== Enum.TestResultStatus.EVALUATED) {
    return <ProcessingResult testId={testId + ''} />
  }

  const TABS = [
    {
      label: 'Analysis',
      key: 'analysis',
      children: <>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Row gutter={[20, 20]}>
              <Col xs={24} md={12} lg={8}>
                {loadingResult ? (
                  <Card style={{ marginBottom: 20, textAlign: 'center' }}>
                    <Skeleton active />
                  </Card>
                ) : (
                  <Card style={{ marginBottom: 20, textAlign: 'center' }}>
                    {/* @ts-ignore */}
                    {test.passingScore ? (
                      <Title level={4}>
                        Passing Score: {metrics.passingScore}
                      </Title>
                    ) : null}
                    <Title style={{ marginBottom: 15,margin: (!metrics.passingScore)?0:'auto' }} level={4}>
                      You Scored: {Math.ceil(metrics.learnerScore)} out of{' '}
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
                {loadingResult ? (
                  <Card style={{ height: 300 }}>
                    <Skeleton active />
                  </Card>
                ) : !(
                  pieChartData[0].value === 0 && pieChartData[1].value === 0
                ) ? (
                  <Row><Col xs={24}>{PiechartComponent}</Col></Row>
                ) : null}
              </Col>
              <Col xs={24} md={12} lg={16}>
                {loadingResult ? (
                  <Card
                    style={{
                      marginBottom: 20,
                      textAlign: 'center',
                      height: 450
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
                      <Card title="Test Analysis Report">
                        <Title level={3}>Section wise breakdown</Title>
                        {test?.sections?.map(section => {
                          const attemptedPercent = Math.ceil(
                            section?.stats?.questionsAttempted /
                            section?.stats?.totalQuestions *
                            100
                          )
                          const correctPercent = Math.ceil(
                            section?.stats?.questionsAnsweredCorrectly /
                            section?.stats?.totalQuestions *
                            100
                          )
                          return (
                            <Row key={section.title}>
                              <Col sm={24}>
                                <Title level={5}>
                                  {capitalize(section.title)}:
                                </Title>
                              </Col>
                              <Col sm={24}>
                                <Row gutter={[20, 20]}>
                                  <Col span={12}>
                                    Attempted{' '}
                                    {section?.stats?.questionsAttempted}/{
                                      section?.stats?.totalQuestions
                                    }
                                    <Progress
                                      format={() => ''}
                                      percent={attemptedPercent}
                                    />
                                  </Col>
                                  <Col span={12}>
                                    Correct{' '}
                                    {section?.stats?.questionsAnsweredCorrectly}/{
                                      section?.stats?.totalQuestions
                                    }
                                    <Progress
                                      format={() => ''}
                                      percent={correctPercent}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Divider />
                            </Row>
                          )
                        })}
                      </Card>
                    </Col>
                    {leaderboard && leaderboard.length ? (
                      <Col span={24}>
                        <Card title="Leaderboard">
                          <TestLeaderboard />
                        </Card>
                      </Col>
                    ) : null}
                    {/* {} */}
                  </Row>
                )}
              </Col>
            </Row>
          </Col>
        </Row></>
    },
  ];

  if (feedback.length) {
    TABS.push(  {
      label: 'Feedback',
      key: 'feedback',
      children: <>
        {
          feedback.length ? (
            <Col span={24}>
              <Card title="Feedback">
                <List
                  size="large"
                  // pagination={{ position, align }}
                  dataSource={feedback}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        style={{ margin: '10px 0' }}
                        description={
                          <Row gutter={[20, 20]}>
                            <Col span={24}>
                              <Space style={{ marginTop: 10 }}>
                                <Text>
                                  {item.topics.map(topic => (
                                    <Button
                                      icon={<LinkOutlined />} size='small'
                                      style={{ marginBottom: 3, cursor: 'pointer' }}
                                      color="blue" onClick={() => window.open(`https://www.google.com/search?q=${topic}`)}
                                    >
                                      {topic}
                                    </Button>
                                  ))}
                                </Text>
                              </Space>
                            </Col>
                            <Col span={24}>
                              {item.questionIds.map(i => (
                                <ActionModal cta={<Button type="primary" size="small">
                                  View Question
                                </Button>}>
                                  <TestPlayerItemReiew testId={testId} questionId={i} />
                                </ActionModal>
                              ))}
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
          ) : null}</>
    })
  }

  return (
    <ProtectedContent title="Verification Required"
      isVerified={learner.profile.status === Enum.LearnerProfileStatus.COMPLETE}
      message={
        <Alert
          icon={<UserOutlined />}
          message="Please complete your profile to view test result"
        />
      }
      cta={<LearnerProfile />}
    >
      <Header
        title={!isMobile ? `Test Result: ${test?.title}` : ExitButton}
        extra={
          <div style={{marginTop:10}}>
            {ViewSolutions} {ExitButton}
          </div>
        }
      >
        <Tabs navigateWithHash items={TABS} />
      </Header>
    </ProtectedContent>
  )
}
