import React, { Fragment, useState } from 'react'
import Stepper from '@Components/Stepper'
import { Types } from '@adewaskar/lms-common'
import CourseQuestionStep from './QuestionStep'
import { Button, Result, Space } from 'antd'
import { Alert } from 'antd'

interface CoursePlayerItemsPropsI {
    quiz: Types.CourseQuiz;
    onEnd:()=>void;
}

const QuizStepper: React.FC<CoursePlayerItemsPropsI> = ({ quiz,onEnd }) => {
  const [isEnded, setIsEnded] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState<any>({})
  const [checkedAnswer, setCheckedAnswer] = useState<any>({})
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
    console.log(
      questionsAnswered[questionIndex],
      question.correctOptions,
      'question.correctOptions'
    )
     setCheckedAnswer({
        ...checkedAnswer,
        [questionIndex]: true
      })
  }

  const CorrectAnswerAlert = (
    <Alert showIcon message="Good Job!" type="success" />
  )
  const WrongAnswerAlert = (
    <Alert showIcon message="Incorrect Answer!" type="error" />
  )
  if (isEnded) {
    return (
      <Result
        status="success"
        title="Great job! You are ready to move on to the next lecture."
        subTitle="You got 4 out of 5 correct.
        "
        extra={[
            <Button key="buy">Retry Quiz</Button>,
            <Button type="primary" key="console">
            Continue
          </Button>,
        ]}
      />
    )
  }
    return (
    //   @ts-ignore
    <Stepper
      position="bottom"
      steps={
        quiz?.questions?.map((question, index) => {
          console.log(checkedAnswer, 'checkedAnswer')
          const isAnswerChecked = checkedAnswer[index]
          const isCorrectAnswer =
            isAnswerChecked &&
            questionsAnswered[index].join(',') ===
              question.correctOptions.join(',')
          console.log(isCorrectAnswer, 'isCorrectAnswer')
          return {
            content: (
              <Fragment>
                {isAnswerChecked
                  ? isCorrectAnswer ? CorrectAnswerAlert : WrongAnswerAlert
                  : null}
                <CourseQuestionStep
                  isAnswerChecked={isAnswerChecked}
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
            }
            // validator: () => !!questionsAnswered[index]
          }
        }) || []
      }
      nextCta={({ question, questionIndex }, next) => {
        return (
          <Space>
            <Button type="text">Skip Question</Button>
            {checkedAnswer[questionIndex] ? (
              <Button type="primary" onClick={e => next()}>
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                disabled={!questionsAnswered[questionIndex]}
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
