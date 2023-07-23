import React, { Fragment, useState } from 'react'
import { Card, Typography } from 'antd'
import Stepper from '@Components/Stepper'
import { Types } from '@adewaskar/lms-common'
import QuizStepper from './QuizStepper'

interface CoursePlayerItemsPropsI {
  item: Types.CourseSectionItem;
}

const CoursePlayerQuiz: React.FC<CoursePlayerItemsPropsI> = props => {
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  return (
    <Card style={{ margin: 30, overflow: 'scroll', height: '100%' }}>
      {!isQuizStarted ? (
        <Fragment>
          {/* @ts-ignore */}
          <QuizStepper quiz={props.item.quiz} />{' '}
        </Fragment>
      ) : (
        <Fragment>
          <Typography.Title>#QUIZ: {props.item?.title || ''}</Typography.Title>
          <Typography.Text>
            #QUIZ: {props.item?.description || ''}
          </Typography.Text>
        </Fragment>
      )}
    </Card>
  )
}

export default CoursePlayerQuiz
