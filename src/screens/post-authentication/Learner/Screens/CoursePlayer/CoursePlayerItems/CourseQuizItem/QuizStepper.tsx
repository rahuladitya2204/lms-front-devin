// @ts-nocheck
import React, { Fragment, useState } from 'react'
import Stepper from '@Components/Stepper'
import { Types } from '@adewaskar/lms-common'
import CourseQuestionStep from './QuestionStep'
import { Button, Space } from 'antd'
import { Alert } from 'antd'

interface CoursePlayerItemsPropsI {
  quiz: Types.CourseQuiz;
}

const QuizStepper: React.FC<CoursePlayerItemsPropsI> = ({ quiz }) => {
  const [questionsAnswered, setQuestionsAnswered] = useState({})
  const [checkedAnswer, setCheckedAnswer] = useState({})
  const saveAnswer = (questionIndex: number, answerIndex: number) => {
    const answers = { ...questionsAnswered }
    if (!answers[questionIndex]) {
      answers[questionIndex] = []
    }
    if (quiz.questions[questionIndex].type === 'single') {
      answers[questionIndex] = [answerIndex]
    } else {
      const index = answers[questionIndex].indexOf(answerIndex)
      if (index === -1) {
        answers[questionIndex].push(answerIndex)
      } else {
        answers[questionIndex].splice(index, 1)
      }
    }
    setQuestionsAnswered(answers)
  }

  const checkAnswer = (
    question: Types.CourseQuizQuestion,
    questionIndex: number
  ) => {
    if (
      questionsAnswered[questionIndex] &&
      questionsAnswered[questionIndex].join(',') ===
        question.correctOptions.join(',')
    ) {
      setCheckedAnswer({
        ...checkedAnswer,
        [questionIndex]: true
      })
    }
  }

  const CorrectAnswerAlert = (
    <Alert showIcon message="Good Job!" type="success" />
  )
  const WrongAnswerAlert = (
    <Alert showIcon message="Incorrect Answer!" type="error" />
  )

  return (
    <Stepper
      position="bottom"
      alertMessage={WrongAnswerAlert}
      steps={
        quiz?.questions?.map((question, index) => {
          return {
            content: (
              <Fragment>
                <CourseQuestionStep
                  answerGiven={questionsAnswered[index]}
                  saveAnswerByLearner={answerIndex =>
                    saveAnswer(index, answerIndex)
                  }
                  question={question}
                />
              </Fragment>
            ),
            data: {
              question,
              questionIndex: index
            },
            validator: !!questionsAnswered[index]
          }
        }) || []
      }
      nextCta={({ question, questionIndex }, next) => {
        return (
          <Space>
            <Button type="outline">Skip Question</Button>
            {checkedAnswer[questionIndex] ? (
              <Button type="primary" onClick={e => next()}>
                Next
              </Button>
            ) : (
              <Button
                type="primary" disabled={!questionsAnswered[questionIndex]}
                onClick={e => checkAnswer(question, questionIndex)}
              >
                Check Answer
              </Button>
            )}
          </Space>
        )
      }}
    />
  )
}

export default QuizStepper
