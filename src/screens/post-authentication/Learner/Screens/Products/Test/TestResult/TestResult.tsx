// @ts-nocheck
import {
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
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'

import HtmlViewer from '@Components/HtmlViewer'
import { Learner } from '@adewaskar/lms-common'
import Tabs from '@Components/Tabs'
import TestMetrics from './TestMetrics'
import { capitalize } from 'lodash'
import { useParams } from 'react-router'
import TestResultTable from './TestResultTable'

const { Title, Text } = Typography

const LearnerTestResult = function() {
  const { testId } = useParams()
  const {
    data: { test },
    isLoading: loadingResult
  } = Learner.Queries.useGetTestResult(testId + '')
  if (loadingResult) {
    return (
      <Row gutter={[20, 30]}>
        <Col span={24}>
          <LoadingSkeleton />
        </Col>
        <Col span={24}>
          <LoadingSkeleton />
        </Col>
      </Row>
    )
  }
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
                        <HtmlViewer content={item.title} />
                        <Row gutter={[20, 20]}>
                          <Col span={24}>
                            <Row>
                              <Col span={24} style={{ marginTop: 10 }}>
                                <Row justify={'space-between'} align={'middle'}>
                                  <Col>
                                    {item.isAnswered ? (
                                      <>
                                        { item.isCorrect?<Tag color="green">
                                        Answered Correctly
                                      </Tag>:<Tag color="red">
                                        Wrongly Answered
                                      </Tag>}</>
                                    ) : (
                                      <Tag color="blue">Not Answered</Tag>
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
                                            <HtmlViewer content={answer} />
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
      navigateWithHash
      defaultActiveKey="analysis"
      items={[
        {
          key: 'analysis',
          label: 'Analysis',
          children: <TestMetrics />
        },
        {
          key: 'solutions',
          label: 'Solutions',
          children: <TestResultTable />
        }
      ]}
    />
  )
}

export const LoadingSkeleton = () => {
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Card title={<Skeleton.Button block />}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Skeleton paragraph={{ rows: 3 }} />
            </Col>
            <Col span={24}>
              <Row justify={'space-between'}>
                <Col>
                  <Skeleton.Button />
                </Col>
                <Col>
                  <Skeleton.Button />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[20, 10]}>
                <Col span={24}>
                  <Skeleton.Input block />
                </Col>
                <Col span={24}>
                  <Skeleton.Input block />
                </Col>
                <Col span={24}>
                  <Skeleton.Input block />
                </Col>
                <Col span={24}>
                  <Skeleton.Input block />
                </Col>
              </Row>{' '}
            </Col>
            <Col span={24}>
              <Skeleton paragraph={{ rows: 3 }} />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}
