import { Constants, Types } from '@adewaskar/lms-common'

import { cloneDeep } from 'lodash'
import { create } from 'zustand'
import dayjs from 'dayjs'

interface TestStore {
  enrolledProduct: Types.EnrolledProductDetails;
  test: Types.Test;
  testStatus: Types.TestStatus;
  initializeStore: (
    enrolledProduct: Types.EnrolledProductDetails,
    test: Types.Test
  ) => void;
  updateTestStatus: (t?: Types.Test, ep?: Types.EnrolledProductDetails) => void;
  submitAnswer: (submitTestAnswer: Types.SubmitTestAnswer) => Promise<void>;
}

export const useTestPlayerStore =
  create <
  TestStore >
  (set => ({
    enrolledProduct: Constants.INITIAL_ENROLLED_PRODUCT_DETAILS,
    test: Constants.INITIAL_TEST_DETAILS,
    testStatus: Constants.INITIAL_TEST_STATUS,

    initializeStore: (enrolledProduct, test) => {
      set({ enrolledProduct, test })
      // Call updateTestStatus after state update
      useTestPlayerStore.getState().updateTestStatus(test, enrolledProduct)
    },

    submitAnswer: async ({ questionId, answer }) => {
      // You would implement the logic for updating the test status and enrolled product here
      // This is a placeholder implementation
      set(state => {
        const enrolledProductCopy = cloneDeep(state.enrolledProduct)
        // debugger
        const responseIndex = enrolledProductCopy.metadata.test.responses.findIndex(
          r => r.question === questionId
        )

        if (responseIndex >= 0) {
          // Update existing response
          let response =
            enrolledProductCopy.metadata.test.responses[responseIndex]
          response = {
            ...response,
            answer: answer,
            submittedAt: dayjs()
              .toDate()
              .toString()
          }
          enrolledProductCopy.metadata.test.responses[responseIndex] = response
        } else {
          // Add new response
          enrolledProductCopy.metadata.test.responses.push({
            question: questionId,
            answer: answer,
            submittedAt: dayjs()
              .toDate()
              .toString(),
            timeSpent: 0,
            isMarked: false
            // Add any other necessary fields for a new response
          })
        }
        return { ...state, enrolledProduct: enrolledProductCopy }
      })
      useTestPlayerStore.getState().updateTestStatus()
    },
    updateTestStatus: (
      testR?: Types.Test,
      enrolledTestR?: Types.EnrolledProductDetails
    ) => {
      set(state => {
        const enrolledTest = enrolledTestR || state.enrolledProduct
        const questionResponses = enrolledTest.metadata.test.responses
        const test = state.test || testR

        const testStartTime =
          test.startedAt || enrolledTest.metadata.test.startedAt
        const testEndTime = test.endedAt || enrolledTest.metadata.test.endedAt

        let totalAnswered = 0,
          totalQuestions = 0
        // @ts-ignore
        const sections: Types.TestStatusSection[] = test.sections.map(
          section => {
            return {
              ...section,
              items: section.items.map(item => {
                const QUESTION = questionResponses.find(
                  response => response.question === item._id
                )
                let isAnswered = !!QUESTION?.submittedAt
                let answerGiven = QUESTION?.answer
                let timeSpent = QUESTION?.timeSpent
                let isMarked = QUESTION?.flag === 'review-later'

                if (isAnswered) {
                  totalAnswered++
                }
                totalQuestions++

                return { ...item, isAnswered, answerGiven, timeSpent, isMarked }
              })
            }
          }
        )

        const updatedTestStatus: Types.TestStatus = {
          ...state.testStatus,
          sections,
          totalAnswered,
          totalQuestions,
          hasStarted: !!testStartTime,
          hasEnded: !!testEndTime,
          startedAt: testStartTime
          //   endTest: totalAnswered === totalQuestions || test.status === 'ENDED' // Replace 'ENDED' with appropriate status
        }
        console.log(updatedTestStatus, 'updatedTestStatus')
        return { ...state, testStatus: updatedTestStatus }
      })
    }
  }))

export default useTestPlayerStore
