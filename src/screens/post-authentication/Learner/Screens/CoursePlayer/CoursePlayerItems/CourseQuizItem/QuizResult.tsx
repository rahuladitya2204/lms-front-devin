// @ts-nocheck
import { Button, Col, List, Result, Row, Space } from 'antd'
import { CheckOutlined, StarFilled } from '@ant-design/icons'

import { Question } from './useQuizStore'
import { Typography } from '@Components/Typography';
import { useOutletContext } from 'react-router';
import { useParams } from '@Router/index';
import { Learner } from '@adewaskar/lms-common';

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
  const { id: courseId, itemId } = useParams();
  const [, , language] = useOutletContext();
  const totalQuestions = questions.length;
  const correctAnswered = questions.filter(q => q.isCorrectAnswer)
  const wrongAnswered = questions.filter(q => !q.isCorrectAnswer)
  console.log(correctAnswered, wrongAnswered, 'asdasda')
  const isPassed = correctAnswered >= (totalQuestions / 2)
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress();
  return (
    <Row>
      <Col span={24}>
        <Result
          extra={[
            <Button key="buy" onClick={onReset}>
              Retry Quiz
            </Button>,
            <Button onClickCapture={() => {
              updateProgress({
                courseId: courseId || "",
                action: 'ADD',
                itemId: itemId,
                data: null,
              });
            }} type="primary" onClick={onEnd}>
              Continue
            </Button>
          ]}
          status={isPassed ? 'success' : 'error'}
          title={isPassed ? "Great job! You are ready to move on to the next lecture." : 'You didnt pass.'}
          subTitle={`You got ${correctAnswered} out of ${totalQuestions} correct.`}
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
                <Typography.Text>{item.title.text[language]}</Typography.Text>
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
                <Typography.Text>{item.title.text[language]}</Typography.Text>
              </List.Item>
            )}
          />
        </Result>
      </Col>
    </Row >
  )
}
