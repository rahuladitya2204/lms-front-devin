// @ts-nocheck
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Skeleton,
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
import { useNavigate, useParams } from 'react-router'

import Header from '@Components/Header'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import { Learner } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import { useMemo } from 'react'

const { Title, Text, Paragraph } = Typography

export default function TestMetrics() {
  const navigate = useNavigate()
  const { testId } = useParams()
  const {
    data: { test, metrics },
    isFetching: loadingResult
  } = Learner.Queries.useGetTestResult(testId + '')

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
  return (
    <Header
      title={`Test Result: ${test.title}`}
      extra={[
        <Button onClick={() => navigate('review')} type="primary">
          View Solutions
        </Button>
      ]}
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
                  <Title level={4}>Passing Score: {test.passingScore}</Title>
                  <Title style={{ marginBottom: 15 }} level={4}>
                    You Scored: {test.learnerScore} out of{' '}
                    {metrics.totalTestScore}
                  </Title>
                  {metrics.learnerScore >= test.passingScore ? (
                    <Alert message="You have passed this test" type="success" />
                  ) : (
                    <Alert message="You haved failed this test" type="error" />
                  )}
                </Card>
              )}
              {loadingResult ? (
                <Card style={{ height: 300 }}>
                  <Skeleton active />
                </Card>
              ) : (
                <Card title="Overall Performance">
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
                </Card>
              )}
            </Col>
            <Col xs={24} md={12} lg={16}>
              {loadingResult ? (
                <Card
                  style={{ marginBottom: 20, textAlign: 'center', height: 450 }}
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
                          <Title level={5}>{capitalize(section.title)}:</Title>
                        </Col>
                        <Col sm={24}>
                          <Row gutter={[20, 20]}>
                            <Col span={12}>
                              Attempted {section?.stats?.questionsAttempted}/{
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
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  )
}

export const OverallPerformancePie = charts => {
  return (
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
        {charts?.pieChartData?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  )
}
