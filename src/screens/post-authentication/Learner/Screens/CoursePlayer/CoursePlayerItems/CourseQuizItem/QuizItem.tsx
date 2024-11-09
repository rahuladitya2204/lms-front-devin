import { Button, Card, Col, Divider, Result, Row } from 'antd'
import React, { Fragment, useState } from 'react'

import QuizStepper from './QuizStepper'
import { StarFilled } from '@ant-design/icons'
import Stepper from '@Components/Stepper'
import { Types } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'
import { useOutletContext } from 'react-router'
import { Title } from '@Components/Typography/Typography'

interface CoursePlayerItemsPropsI {
  item: Types.CourseSectionItem;
  onEnd: () => void;
}

const CoursePlayerQuiz: React.FC<CoursePlayerItemsPropsI> = ({
  item,
  onEnd
}) => {
  const [, , language] = useOutletContext();
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  console.log(item, 'item')
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
    <Card
      bodyStyle={{ minHeight: 500 }}
    >
      <Title>
        {item.title.text[language]}
      </Title>
      {isQuizStarted ? (
        <Fragment>
          {/* @ts-ignore */}
          <QuizStepper onEnd={onEnd} quiz={item.quiz} />{' '}
        </Fragment>
      ) : (
        <Fragment>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Typography.Title>{item?.title?.[language]}</Typography.Title>
              <Divider />
              <Typography.Paragraph>
                {item?.description?.[language]}
              </Typography.Paragraph>
            </Col>
            <Col span={24}>
              <Row justify={'space-between'}>
                <Col>
                  <Typography.Text strong>
                    5 mins
                    <Divider type="vertical" />
                    {item.quiz?.questions.length} Questions
                  </Typography.Text></Col>
                <Col>
                  <Button>Skip Quiz</Button>
                  <Button
                    style={{ marginLeft: 15 }}
                    type="primary"
                    onClick={e => setIsQuizStarted(true)}
                  >
                    Start Quiz
                  </Button></Col>
              </Row>
            </Col>
          </Row>
        </Fragment>
      )}
    </Card>
  )
}

export default CoursePlayerQuiz
