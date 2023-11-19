import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'

import { sec } from 'mathjs'
import { useParams } from 'react-router'

export default function useQuestion() {
  const { questionId, testId } = useParams()
  const { data: { sections } } = Learner.Queries.useGetTestStatus(testId + '')
  // @ts-ignore
  const questions = sections.map(e => e.items).flat()
  const currentQuestionIndex: number = questions.findIndex(
    // @ts-ignore
    q => q._id === questionId
  )
  const currentQuestion =
    questions[currentQuestionIndex] || Constants.INITIAL_TEST_QUESTION
  // console.log(currentQuestion, 'current')
  return {
    currentQuestion,
    currentQuestionIndex,
    loading: false
  }
}
