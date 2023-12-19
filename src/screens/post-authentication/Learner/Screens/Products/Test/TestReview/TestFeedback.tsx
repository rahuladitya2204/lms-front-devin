import { Alert, Col, Row } from 'antd'

import { Types } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography';

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
          <Alert type="success" message={feedback.met} />
        </Col>
      ) : null}
      {feedback.notMet ? (
        <Col span={24}>
          <Title level={4}>What was missing</Title>
          <Alert type="error" message={feedback.notMet} />
        </Col>
      ) : null}
    </Row>
  )
}

export default TestFeedback
