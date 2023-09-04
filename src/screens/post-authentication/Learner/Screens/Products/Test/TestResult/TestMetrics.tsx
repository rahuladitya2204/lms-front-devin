// @ts-nocheck
import {
  Alert,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
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

import HtmlViewer from '@Components/HtmlViewer'
import { Learner } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import { useParams } from 'react-router'

const { Title, Text, Paragraph } = Typography

export default function TestMetrics() {
  const { testId } = useParams()
  const { data: { test, charts } } = Learner.Queries.useGetTestResult(
    testId + ''
  )

  const COLORS = ['#52c41a', '#FF4040', '#D3D3D3'] // Green for correct, Red for wrong, Grey for unattempted

  //   const renderCustomizedLabel = ({
  //     cx,
  //     cy,
  //     midAngle,
  //     innerRadius,
  //     outerRadius,
  //     percent,
  //     index
  //   }) => {
  //     const RADIAN = Math.PI / 180
  //     const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  //     const x = cx + radius * Math.cos(-midAngle * RADIAN)
  //     const y = cy + radius * Math.sin(-midAngle * RADIAN)

  //     return (
  //       <text
  //         x={x}
  //         y={y}
  //         fill="white"
  //         textAnchor={x > cx ? 'start' : 'end'}
  //         dominantBaseline="central"
  //       >
  //         {`${(percent * 100).toFixed(0)}%`}
  //       </text>
  //     )
  //   }

  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Row gutter={[20, 20]}>
          <Col span={8}>
            <Card style={{ marginBottom: 20, textAlign: 'center' }}>
              {/* @ts-ignore */}
              <Title level={4}>Passing Score: {test.passingScore}</Title>
              {/* @ts-ignore */}
              <Title style={{ marginBottom: 15 }} level={4}>
                You Scored: {test.learnerScore} out of {test.totalScore}
              </Title>
              {test.learnerScore >= test.passingScore ? (
                <Alert message="You have passed this test" type="success" />
              ) : (
                <Alert message="You haved failed this test" type="error" />
              )}
            </Card>
            <Card title="Overall Performance">
              <PieChart width={300} height={250}>
                <Pie
                  data={charts.pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#52c41a"
                  //   label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {charts.pieChartData.map((entry, index) => (
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
          </Col>
          <Col span={16}>
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
                    <Col span={24}>
                      <Title level={5}>{capitalize(section.title)}:</Title>
                    </Col>
                    <Col span={24}>
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
                          Correct {section?.stats?.questionsAnsweredCorrectly}/{
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
        </Row>
      </Col>
      <Col span={24}>
        <Card title="Test Analysis Report">
          <BarChart
            width={1100}
            height={300}
            //   @ts-ignore
            data={charts.barChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="correctlyAnswered"
              fill="#52c41a"
              name="Correctly Answered"
            />
            <Bar
              dataKey="wronglyAnswered"
              fill="#FF4040"
              name="Wrongly Answered"
            />
          </BarChart>
        </Card>
      </Col>
    </Row>
  )
}
