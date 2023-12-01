import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  List,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography
} from 'antd'
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
import {
  EditOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Enum, Learner } from '@adewaskar/lms-common'
import { useNavigate, useParams } from 'react-router'

import ActionDrawer from '@Components/ActionDrawer'
import Header from '@Components/Header'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import LearnerProfile from '@Learner/Screens/Account/LearnerProfile'
import { NavLink } from 'react-router-dom'
import ProcessingResult from './ProcessingResult'
import ProtectedContent from '@Components/ProtectedComponent'
import { capitalize } from 'lodash'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useMemo } from 'react'

const { confirm } = Modal
const { Title, Text } = Typography

export default function TestMetrics() {
  const navigate = useNavigate()
  const { testId } = useParams()
  const {
    data: { test, metrics, status, feedback },
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
  const { isMobile } = useBreakpoint()
  console.log(pieChartData, 'as')
  const ViewSolutions = (
    <Button
      style={{ marginRight: 10 }}
      onClick={() => navigate('review')}
      type="primary"
      icon={<EditOutlined />}
    >
      View Solutions
    </Button>
  )
  const ExitButton = (
    <Button
      style={{ width: isMobile ? '100%' : 100 }}
      icon={<LogoutOutlined />}
      onClick={() => {
        confirm({
          title: 'Are you sure?',
          // icon: <ExclamationCircleOutlined />,
          content: `You want to exit reviewing?`,
          onOk() {
            navigate('../')
          },
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

  return (
    <ProtectedContent
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
        title={!isMobile ? `Test Result: ${test?.title}` : null}
        extra={
          isMobile ? (
            <ActionDrawer
              footer={() => [ExitButton]}
              cta={
                <Button
                  type="primary"
                  style={{ marginTop: 10 }}
                  icon={<MenuOutlined />}
                  // shape="circle"
                />
              }
              extra={() => [ViewSolutions]}
            >
              {/* {ViewSolutions} */}
              <div style={{ marginTop: 20 }}>{PiechartComponent}</div>
            </ActionDrawer>
          ) : (
            [ViewSolutions, ExitButton]
          )
        }
      >
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
                    <Title level={4}>
                      Passing Score: {metrics.passingScore}
                    </Title>
                    <Title style={{ marginBottom: 15 }} level={4}>
                      You Scored: {metrics.learnerScore.toFixed(3)} out of{' '}
                      {metrics.totalTestScore}
                    </Title>
                    {metrics.learnerScore >= metrics.passingScore ? (
                      <Alert
                        message="You have passed this test"
                        type="success"
                      />
                    ) : (
                      <Alert
                        message="You haved failed this test"
                        type="error"
                      />
                    )}
                  </Card>
                )}
                {loadingResult ? (
                  <Card style={{ height: 300 }}>
                    <Skeleton active />
                  </Card>
                ) : !(
                  pieChartData[0].value === 0 && pieChartData[1].value === 0
                ) ? (
                  !isMobile ? (
                    PiechartComponent
                  ) : null
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
                    <Col span={24}>
                      <Card title="Test Feedback">
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
                                            <Tag
                                              style={{ marginBottom: 3 }}
                                              color="blue"
                                            >
                                              {topic}
                                            </Tag>
                                          ))}
                                        </Text>
                                      </Space>
                                    </Col>
                                    <Col span={24}>
                                      {item.questionIds.map(i => (
                                        <NavLink
                                          style={{
                                            marginRight: 5,
                                            marginBottom: 3
                                          }}
                                          to={`review/${i}`}
                                        >
                                          <Button type="primary" size="small">
                                            Go to question
                                          </Button>
                                        </NavLink>
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
                  </Row>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    </ProtectedContent>
  )
}
