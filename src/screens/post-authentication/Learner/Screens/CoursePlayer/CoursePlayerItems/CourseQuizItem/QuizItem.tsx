import { Button, Card, Col, Divider, Result, Row } from 'antd'
import React, { Fragment, useState } from 'react'

import QuizStepper from './QuizStepper'
import { StarFilled } from '@ant-design/icons'
import Stepper from '@Components/Stepper'
import { Types } from '@invinciblezealorg/lms-common'
import { Typography } from '@Components/Typography'

interface CoursePlayerItemsPropsI {
  item: Types.CourseSectionItem;
  onEnd: () => void;
}

const CoursePlayerQuiz: React.FC<CoursePlayerItemsPropsI> = ({
  item,
  onEnd
}) => {
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  if (item.isCompleted) {
    return (
      <Result
        status="success"
        extra={<Button type="primary">Go to next lecture</Button>}
        title="Great job! You are ready to move on to the next lecture."
        subTitle="You have completed this quiz."
        icon={<StarFilled />}
      />
    )
  }
  return (
    <div style={{ margin: 30 }}>
      {isQuizStarted ? (
        <Fragment>
          {/* @ts-ignore */}
          <QuizStepper onEnd={onEnd} quiz={item.quiz} />{' '}
        </Fragment>
      ) : (
        <Fragment>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Typography.Title>{item?.title || ''}</Typography.Title>
              <Typography.Text strong>
                5 mins
                <Divider type="vertical" />
                {item.quiz?.questions.length} Questions
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Button>Skip Quiz</Button>
              <Button
                style={{ marginLeft: 15 }}
                type="primary"
                onClick={e => setIsQuizStarted(true)}
              >
                Start Quiz
              </Button>
            </Col>
          </Row>
        </Fragment>
      )}
    </div>
  )
}

export default CoursePlayerQuiz
