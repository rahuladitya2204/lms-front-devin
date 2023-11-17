import { Constants, Learner, Types } from '@adewaskar/lms-common'

import { sec } from 'mathjs'
import { useParams } from 'react-router'
import useTestPlayerStore from './useTestPlayerStore'

export default function useQuestion() {
  const { questionId, testId } = useParams()
  const { sections } = useTestPlayerStore(s => s.testStatus)
  const questions = sections.map(e => e.items).flat()
  const currentQuestionIndex: number = questions.findIndex(
    q => q._id === questionId
  )
  // console.log(sections, 'aslo')
  return {
    currentQuestion:
      questions[currentQuestionIndex] || Constants.INITIAL_TEST_QUESTION,
    currentQuestionIndex,
    loading: false
  }
}
