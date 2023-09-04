// @ts-nocheck
import {
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Tabs,
  Tag,
  Typography
} from 'antd'
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'

import HtmlViewer from '@Components/HtmlViewer'
import { Learner } from '@adewaskar/lms-common'
import TestMetrics from './TestMetrics'
import { capitalize } from 'lodash'
import { useParams } from 'react-router'

const { Title, Text, Paragraph } = Typography

const LearnerTestResult = function() {
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
      {test?.sections?.map((section, sectionIndex) => {
        return (
          <Col span={24} key={sectionIndex}>
            <Card title={section.title}>
              <Row>
                <List
                  style={{ width: '100%' }}
                  dataSource={section.items}
                  renderItem={(item, itemIndex) => {
                    return (
                      <Col span={24} key={item._id}>
                        <Title level={5}>Question {itemIndex + 1}</Title>
                        <Text>{item.title}</Text>
                        <Row gutter={[20, 20]}>
                          <Col span={24}>
                            <Row>
                              <Col span={24} style={{ marginTop: 10 }}>
                                <Row justify={'space-between'} align={'middle'}>
                                  <Col>
                                    {item.isCorrect ? (
                                      <Tag color="green">
                                        Answered Correctly
                                      </Tag>
                                    ) : (
                                      <Tag color="red">Wrongly Answered</Tag>
                                    )}
                                  </Col>
                                  <Col>
                                    <Tag
                                      color={
                                        item.isCorrect
                                          ? 'green-inverse'
                                          : 'red-inverse'
                                      }
                                    >
                                      Score: {item.score || 0}
                                    </Tag>
                                  </Col>
                                </Row>
                              </Col>
                              <Col span={24}>
                                <List
                                  style={{
                                    margin: '20px 0',
                                    borderRadius: 5
                                  }}
                                  bordered
                                  dataSource={item.answers}
                                  renderItem={(answer, answerIndex) => {
                                    const answeredByLearner = item.answers.includes(
                                      answerIndex
                                    )
                                    const isCorrectOption = item.correctOptions.includes(
                                      answerIndex
                                    )
                                    return (
                                      <Row
                                        justify={'space-between'}
                                        align={'middle'}
                                        style={{
                                          background: isCorrectOption
                                            ? '#f6ffed'
                                            : answeredByLearner &&
                                              !isCorrectOption
                                              ? '#fff1f0'
                                              : ''
                                        }}
                                      >
                                        <Col>
                                          <Text
                                            strong
                                            style={{
                                              margin: 10,
                                              display: 'block'
                                            }}
                                          >
                                            {answer || ''}
                                          </Text>
                                        </Col>
                                        <Col style={{ marginRight: 10 }}>
                                          <Text strong type="secondary">
                                            {answeredByLearner ? (
                                              <span>You Answered</span>
                                            ) : (
                                              ''
                                            )}
                                          </Text>
                                        </Col>
                                        <Divider style={{ margin: 0 }} />
                                      </Row>
                                    )
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            {item.solution?.html ? (
                              <Card title={'Solution'}>
                                <HtmlViewer
                                  content={item.solution?.html + ''}
                                />
                              </Card>
                            ) : (
                              <Text>No Solution available</Text>
                            )}
                          </Col>
                        </Row>
                        <Divider />
                      </Col>
                    )
                  }}
                />
              </Row>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default function TestResult() {
  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: '1',
          label: 'Analysis',
          children: <TestMetrics />
        },
        {
          key: '2',
          label: 'Solutions',
          children: <LearnerTestResult />
        }
      ]}
    />
  )
}
