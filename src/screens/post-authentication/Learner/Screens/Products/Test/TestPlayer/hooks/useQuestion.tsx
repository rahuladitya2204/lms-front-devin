import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'

import { sec } from 'mathjs'
import { useMemo } from 'react'
import { useParams } from '@Router/index'

export default function useQuestion() {
  const { questionId, testId } = useParams()
  const { data: { status: { sections } } } = Learner.Queries.useGetTestStatus(
    testId + ''
  )
  // @ts-ignore
  const questions = sections.map(e => e.items).flat()
  const currentQuestionIndex = useMemo(
    () => {
      return questions.findIndex(q => q._id === questionId)
    },
    [questions, questionId]
  )

  const currentQuestion: Types.TestStatusQuestion = useMemo(
    () => {
      if (currentQuestionIndex >= 0 && questions[currentQuestionIndex]) {
        return questions[currentQuestionIndex]
      }
      // Only return INITIAL_TEST_QUESTION if there's no valid question available
      return Constants.INITIAL_TEST_QUESTION
    },
    [currentQuestionIndex, questions]
  )

  return {
    currentQuestion,
    currentQuestionIndex,
    loading: false
  }
}
