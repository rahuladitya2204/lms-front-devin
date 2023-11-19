import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'

import { sec } from 'mathjs'
import { useParams } from 'react-router'

export default function useQuestion() {
  const { questionId, testId } = useParams()
  const { sections } = Store.useTestStore(s => s.testStatus)
  const questions = sections.map(e => e.items).flat()
  const currentQuestionIndex: number = questions.findIndex(
    q => q._id === questionId
  )
  const currentQuestion = questions[currentQuestionIndex] || Constants.INITIAL_TEST_QUESTION;
  return {
    currentQuestion,
    currentQuestionIndex,
    loading: false
  }
}
