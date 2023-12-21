import { Alert, Col, Row } from 'antd'

import { Paragraph } from '@Components/Typography/Typography'
import { Types } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'

const { Title } = Typography

interface TestSolutionPropsI {
  currentQuestion: Types.TestStatusQuestionStats;
}

const TestFeedback = (props: TestSolutionPropsI) => {
  const { currentQuestion: { feedback } } = props
  return (
    <Row>
      {feedback.met ? (
        <Col span={24}>
          <Title level={4}>What was right</Title>
          <Alert
            type="success"
            message={
              <Paragraph style={{ fontSize: 16 }}>{feedback.met}</Paragraph>
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
              <Paragraph style={{ fontSize: 16 }}>{feedback.notMet}</Paragraph>
            }
          />
        </Col>
      ) : null}
    </Row>
  )
}

export default TestFeedback
