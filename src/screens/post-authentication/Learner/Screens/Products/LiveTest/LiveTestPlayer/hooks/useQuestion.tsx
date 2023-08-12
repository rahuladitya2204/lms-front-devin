import { Constants, Learner, Types } from '@adewaskar/lms-common'

import { useParams } from 'react-router'

export default function useQuestion() {
  const { questionId, testId } = useParams()
  const { data: { sections } } = Learner.Queries.useGetLiveTestStatus(
    testId + ''
  )
  const questions = sections.map(e => e.items).flat()
  const currentQuestionIndex: number = questions.findIndex(
    q => q._id === questionId
  )
  return {
    currentQuestion:
      questions[currentQuestionIndex] || Constants.INITIAL_LIVE_TEST_QUESTION,
    currentQuestionIndex
  }
}
