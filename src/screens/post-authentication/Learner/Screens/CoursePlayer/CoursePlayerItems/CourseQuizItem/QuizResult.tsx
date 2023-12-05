// @ts-nocheck
import { Button, Col, List, Result, Row, Space, Typography } from 'antd'
import { CheckOutlined, StarFilled } from '@ant-design/icons'

import { Question } from './useQuizStore'

interface QuizResultPropsI {
  questions: Question[];
  onReset: () => void;
  onEnd: () => void;
}

export default function QuizResult({
  questions,
  onReset,
  onEnd
}: QuizResultPropsI) {
  const correctAnswered = questions.filter(q => q.isCorrectAnswer)
  const wrongAnswered = questions.filter(q => !q.isCorrectAnswer)
  return (
    <Row>
      <Col span={24}>
        <Result
          extra={[
            <Button key="buy" onClick={onReset}>
              Retry Quiz
            </Button>,
            <Button type="primary" onClick={onEnd}>
              Continue
            </Button>
          ]}
          status="success"
          title="Great job! You are ready to move on to the next lecture."
          subTitle="You got 4 out of 5 correct.
    "
          icon={<StarFilled />}
        >
          <List
            header={
              <Typography.Title level={5}>
                {' '}
                <CheckOutlined style={{ fontSize: 14 }} /> What you know
              </Typography.Title>
            }
            dataSource={correctAnswered}
            renderItem={item => (
              <List.Item>
                <Typography.Text>{item.title}</Typography.Text>
              </List.Item>
            )}
          />

          <List
            header={
              <Typography.Title level={5}>
                {' '}
                What you should review
              </Typography.Title>
            }
            dataSource={wrongAnswered}
            renderItem={item => (
              <List.Item>
                <Typography.Text>{item.title}</Typography.Text>
              </List.Item>
            )}
          />
        </Result>
      </Col>
    </Row>
  )
}
