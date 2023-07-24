import React, { Fragment, useState } from 'react'
import { Button, Card, Col, Divider, Row, Typography } from 'antd'
import Stepper from '@Components/Stepper'
import { Types } from '@adewaskar/lms-common'
import QuizStepper from './QuizStepper'

interface CoursePlayerItemsPropsI {
  item: Types.CourseSectionItem;
}

const CoursePlayerQuiz: React.FC<CoursePlayerItemsPropsI> = ({ item }) => {
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  return (
    <div style={{ margin: 30 }}>
      {isQuizStarted ? (
        <Fragment>
          {/* @ts-ignore */}
          <QuizStepper quiz={item.quiz} />{' '}
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
