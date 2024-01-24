import { Alert, Button, Col, Row, Tag, Tooltip } from 'antd'
import { Enum, Learner, Types } from '@adewaskar/lms-common'
import React, { useMemo } from 'react'

import { Paragraph } from '@Components/Typography/Typography'
import { Typography } from '@Components/Typography'
import { isMongoId } from '@Components/SunEditor/utils'

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
    [test]
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
    const { criteria } = item?.criterias.find(c => c._id === mongoId)
    return (
      <Tooltip title={criteria}>
        <Tag style={{ marginRight: 0, cursor: 'pointer' }}>Show More</Tag>
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
  // const testItem
  return (
    <Row>
      {feedback.met ? (
        <Col span={24}>
          <Title level={4}>What was right</Title>
          <Alert
            type="success"
            message={
              <Paragraph style={{ fontSize: 16 }}>
                <CriteriaElement
                  testId={props.testId}
                  itemId={props.itemId}
                  text={feedback.met}
                  criterias={[]}
                />
              </Paragraph>
            }
          />
        </Col>
      ) : null}
      {feedback.notMet ? (
        <Col span={24}>
          <Title level={4}>What was missing</Title>
          <Alert
            type="error"
            message={
              <Paragraph style={{ fontSize: 16 }}>
                <CriteriaElement
                  testId={props.testId}
                  itemId={props.itemId}
                  text={feedback.notMet}
                  criterias={[]}
                />
              </Paragraph>
            }
          />
        </Col>
      ) : null}
    </Row>
  )
}

export default TestFeedback
