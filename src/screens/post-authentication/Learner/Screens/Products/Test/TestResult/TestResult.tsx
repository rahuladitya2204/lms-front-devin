import { Card, Col, Divider, List, Row, Tag, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import Header from '@Components/Header'
import HtmlViewer from '@Components/HtmlViewer'
import { useParams } from 'react-router'

const { Title, Text, Paragraph } = Typography

export default function LearnerTestResult() {
  const { testId } = useParams()
  const {
    data: { product: { data: test }, metadata }
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const getQuestionResponse = (questionId: string) => {
    return metadata.test.answers.find(q => q.question === questionId)
  }
  return (
    <Row>
      {test?.sections?.map(
        (section: Types.TestSection, sectionIndex: number) => {
          return (
            <Col span={24}>
              <Card title={section.title}>
                <Row>
                  <List
                    style={{ width: '100%' }}
                    dataSource={section.items}
                    renderItem={(item, itemIndex) => {
                      const details = getQuestionResponse(item._id)
                      // @ts-ignore
                      const answersGiven = details?.answers
                      console.log(details, '111')
                      return (
                        <Col span={24} key={item._id}>
                          <Title level={5}>Question {itemIndex + 1}</Title>
                          <Text>{item.title}</Text>
                          <Row gutter={[20, 20]}>
                            <Col span={24}>
                              <Row>
                                <Col span={24} style={{ marginTop: 10 }}>
                                  <Row
                                    justify={'space-between'}
                                    align={'middle'}
                                  >
                                    <Col>
                                      {details?.isCorrect ? (
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
                                          details?.isCorrect
                                            ? 'green-inverse'
                                            : 'red-inverse'
                                        }
                                      >
                                        Score: {details?.score || 0}
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
                                    dataSource={item.answers.map(i => {
                                      if (!i) return ''
                                      return i
                                    })}
                                    renderItem={(answer, answerIndex) => {
                                      const answeredByLearner =
                                        (details?.answers || []).indexOf(
                                          answerIndex
                                        ) > -1
                                      const isCorrectOption =
                                        item.correctOptions.indexOf(
                                          answerIndex
                                        ) > -1
                                      return (
                                        <Row
                                          justify={'space-between'}
                                          align={'middle'}
                                          style={{
                                            background: isCorrectOption
                                              ? '#f6ffed'
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
                                              // strong
                                              key={answer + ''}
                                            >
                                              {/* {item.correctOptions.indexOf()} */}
                                              {answer || ''}
                                            </Text>
                                          </Col>
                                          <Col style={{ marginRight: 10 }}>
                                            <Text strong>
                                              {answeredByLearner
                                                ? 'You Answered'
                                                : ''}
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
                  />{' '}
                </Row>
              </Card>
            </Col>
          )
        }
      )}
    </Row>
  )
}
