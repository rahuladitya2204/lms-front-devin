import { Alert, Button, Col, Divider, Row, Space, Tag, Tooltip } from 'antd'
import {
  CheckCircleTwoTone,
  CheckOutlined,
  CloseCircleTwoTone,
  CloseOutlined,
  FileImageOutlined
} from '@ant-design/icons'
import { Enum, Learner, Types } from '@invinciblezealorg/lms-common'
import { Paragraph, Text } from '@Components/Typography/Typography'
import React, { useMemo } from 'react'

import AppImage from '@Components/Image'
import { Typography } from '@Components/Typography'
import { isMongoId } from '@Components/Editor/SunEditor/utils'
import { useModal } from '@Components/ActionModal/ModalContext'

const { Title } = Typography

interface TestSolutionPropsI {
  currentQuestion: Types.TestStatusQuestionStats;
  testId: string;
  itemId: string;
}

export function CriteriaElement(props: {
  text: string,
  testId: string,
  itemId: string,
  criterias: Types.TestQuestionCriteria[]
}) {
  const { data: test } = Learner.Queries.useGetTestDetails(
    props.testId,
    Enum.TestDetailMode.RESULT
  )
  const item = useMemo(
    () => {
      const items = test.sections.map(s => s.items).flat()
      return items.find(d => d._id === props.itemId)
    },
    [test, props.itemId]
  )
  function processStringWithMongoDBIds(
    inputString: string,
    callback: Function
  ) {
    const objectIdRegex = /\b[0-9a-fA-F]{24}\b/g
    let parts = inputString.split(objectIdRegex)
    let matches = inputString.match(objectIdRegex) || []

    return parts.flatMap((part, index) => [
      part,
      index < matches.length ? callback(matches[index]) : null
    ])
  }

  const renderMongoId = (mongoId: string) => {
    // @ts-ignore
    const d = item?.criterias.find(c => c._id === mongoId)
    return (
      <Tooltip title={d?.criteria}>
        <Tag
          // style={{ cursor: 'pointer' }}
          style={{ marginRight: 0, cursor: 'pointer' }}
        >
          Show More
        </Tag>
      </Tooltip>
    )
  }

  const processedContent = processStringWithMongoDBIds(
    props.text,
    renderMongoId
  )

  return <div>{processedContent}</div>
}

const TestFeedback = (props: TestSolutionPropsI) => {
  const { currentQuestion: { feedback } } = props
  const { data: test } = Learner.Queries.useGetTestDetails(
    props.testId,
    Enum.TestDetailMode.RESULT
  )
  const item = useMemo(
    () => {
      const items = test.sections.map(s => s.items).flat()
      return items.find(d => d._id === props.itemId)
    },
    [test, props.itemId]
  )
  const { openModal } = useModal()
  // const testItem
  return (
    <Row>
      {feedback.met?.criteriaIds?.length ? (
        <Col span={24}>
          <Title level={4}>What was right</Title>
          <Alert
            type="success"
            message={
              <div>
                {item?.criterias
                  ?.filter(
                    i => i._id && feedback.met.criteriaIds.includes(i._id)
                  )
                  .map(c => {
                    return (
                      <div>
                        <Space>
                          <Tag
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              // @ts-ignore
                              openModal(<AppImage src={c.image} />, {
                                title: c.criteria                              })
                            }}
                            icon={
                              // @ts-ignore
                              c.image ? (
                                <FileImageOutlined />
                              ) : (
                                <CheckCircleTwoTone
                                // style={{ marginRight: 3, marginTop: 13 }}
                                />
                              )
                            }
                          >
                            {c.score.toString()}
                          </Tag>

                          <Title style={{ fontSize: 14 }} level={4}>
                            {c.criteria}
                          </Title>
                        </Space>
                      </div>
                    )
                  })}
                <Divider />
                <Paragraph style={{ fontSize: 16 }}>
                  <CriteriaElement
                    testId={props.testId}
                    itemId={props.itemId}
                    text={feedback.met.text}
                    criterias={[]}
                  />
                </Paragraph>
              </div>
            }
          />
        </Col>
      ) : null}
      {feedback.notMet?.criteriaIds?.length ? (
        <Col span={24}>
          <Title level={4}>What was missing</Title>
          <Alert
            type="error"
            message={
              <div>
                {item?.criterias
                  ?.filter(
                    i => i._id && feedback.notMet.criteriaIds.includes(i._id)
                  )
                  .map(c => {
                    return (
                      <div>
                        <Space>
                          {' '}
                          <Tag
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              // @ts-ignore
                              openModal(<AppImage src={c.image} />, {
                                title: c.criteria
                              })
                            }}
                            icon={
                              // @ts-ignore
                              c.image ? (
                                <FileImageOutlined />
                              ) : (
                                <CloseCircleTwoTone
                                // style={{ marginRight: 3, marginTop: 13 }}
                                />
                              )
                            }
                          >
                            {c.score.toString()}
                          </Tag>
                          <Title style={{ fontSize: 14 }} level={4}>
                            {c.criteria}
                          </Title>
                        </Space>
                      </div>
                    )
                  })}
                <Divider />
                <Paragraph style={{ fontSize: 16 }}>
                  <CriteriaElement
                    testId={props.testId}
                    itemId={props.itemId}
                    text={feedback.notMet.text}
                    criterias={[]}
                  />
                </Paragraph>
              </div>
            }
          />
        </Col>
      ) : null}
    </Row>
  )
}

export default TestFeedback
