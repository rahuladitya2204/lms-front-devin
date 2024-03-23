import { Button, Space } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'

import { Alert } from 'antd'
import CourseQuestionStep from './QuestionStep'
import QuizResult from './QuizResult'
import Stepper from '@Components/Stepper'
import { Types } from '@invinciblezealorg/lms-common'
import { useQuizStore } from './useQuizStore'

interface CoursePlayerItemsPropsI {
  quiz: Types.CourseQuiz;
  onEnd: () => void;
}

const QuizStepper: React.FC<CoursePlayerItemsPropsI> = ({ quiz, onEnd }) => {
  const [isEnded, setIsEnded] = useState(false)
  const questions = useQuizStore(state => state.questions)
  const {
    saveAnswer,
    checkAnswer,
    setQuestions,
    resetQuestions
  } = useQuizStore(state => state)

  useEffect(
    () => {
      // @ts-ignore
      setQuestions(quiz.questions)
    },
    [quiz]
  )

  const CorrectAnswerAlert = (
    <Alert showIcon message="Good Job!" type="success" />
  )
  const WrongAnswerAlert = (
    <Alert showIcon message="Incorrect Answer!" type="error" />
  )

  const checkResult = () => {
    setIsEnded(true)
  }

  if (isEnded) {
    return (
      <QuizResult
        onReset={() => {
          resetQuestions()
          setIsEnded(false)
        }}
        onEnd={onEnd}
        questions={questions}
      />
    )
  }
  return (
    //   @ts-ignore
    <Stepper
      position="bottom"
      steps={
        questions?.map((question, index) => {
          const isAnswerChecked = question.isAnswerChecked
          const isCorrectAnswer = isAnswerChecked
          // &&
          // question?.answered?.join(',') === question.correctOptions.join(',')

          return {
            content: (
              <Fragment>
                {isAnswerChecked
                  ? isCorrectAnswer ? CorrectAnswerAlert : WrongAnswerAlert
                  : null}
                <CourseQuestionStep
                  isAnswerChecked={!!isAnswerChecked}
                  //   @ts-ignore
                  answerGiven={question.answered}
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
            }
          }
        }) || []
      }
      submitCta={({ questionIndex, question }) =>
        question.isAnswerChecked ? (
          <Button type="primary" onClick={e => checkResult()}>
            See Results
          </Button>
        ) : (
          <Button
            type="primary"
            disabled={!question.answered}
            onClick={e => checkAnswer(questionIndex)}
          >
            Check Answer
          </Button>
        )
      }
      //   @ts-ignore
      nextCta={
        questions.length
          ? ({ question, questionIndex }, next) => {
              return (
                <Space>
                  <Button type="text">Skip Question</Button>
                  {question.isAnswerChecked ? (
                    <Button type="primary" onClick={e => next()}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      disabled={!question.answered}
                      onClick={e => checkAnswer(questionIndex)}
                    >
                      Check Answer
                    </Button>
                  )}
                </Space>
              )
            }
          : console.log
      }
    />
  )
}

export default QuizStepper
