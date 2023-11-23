import { Alert, Col, Row, Typography } from 'antd'

import { Types } from '@adewaskar/lms-common'

const { Title } = Typography

interface TestSolutionPropsI {
  currentQuestion: Types.TestStatusQuestionStats;
}

const TestFeedback = (props: TestSolutionPropsI) => {
  const { currentQuestion: { feedback } } = props
  return (
    <Row>
      <Col span={24}>
        <Title level={4}>What was right</Title>
        <Alert type="success" message={feedback.met} />
      </Col>
      <Col span={24}>
        <Title level={4}>What was missing</Title>
        <Alert type="error" message={feedback.notMet} />
      </Col>
    </Row>
  )
}

export default TestFeedback
