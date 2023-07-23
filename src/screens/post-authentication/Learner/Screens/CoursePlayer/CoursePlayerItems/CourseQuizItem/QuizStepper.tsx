// @ts-nocheck
import React, { useState } from 'react'
import { Card, Typography } from 'antd'
import Stepper from '@Components/Stepper'
import { Types } from '@adewaskar/lms-common'
import CourseQuestionStep from './QuestionStep'

interface CoursePlayerItemsPropsI {
  quiz: Types.CourseQuiz;
}

const QuizStepper: React.FC<CoursePlayerItemsPropsI> = ({ quiz }) => {
  const [questionsAnswered, setQuestionsAnswered] = useState([])
  const saveAnswer = (questionIndex: number, answerIndex: number) => {
    const answers = [...questionsAnswered]
      answers[questionIndex] = answerIndex;
      setQuestionsAnswered(answers)
  }
  console.log(questionsAnswered, '21312312')
  return (
    <Stepper
      position="bottom"
      steps={
        quiz?.questions?.map((question, index) => {
          return {
            content: (
              <CourseQuestionStep answerGivenIndex={questionsAnswered[index]}
                saveAnswerByLearner={answerIndex =>
                  saveAnswer(index, answerIndex)
                }
                question={question}
              />
            ),
            validator: !!questionsAnswered[index]
          }
        }) || []
      }
    />
  )
}

export default QuizStepper
