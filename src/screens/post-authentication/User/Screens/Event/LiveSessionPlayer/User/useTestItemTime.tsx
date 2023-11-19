import { Learner, Store } from '@adewaskar/lms-common'
import { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router-dom'

export const useTestItemTime = () => {
  const { questionId, testId } = useParams()
  const {
    mutate: updateTestStatus,
    isLoading: updatingTestStatus
  } = Learner.Queries.useUpdateTestStatus(testId + '')
  const mountTimeRef = useRef(Date.now())
  const questionIdRef = useRef(questionId)
  const accumulatedTimeRef = useRef(0)
  const apiCalledRef = useRef(false)
  const { mutate: updateTimeSpent } = Learner.Queries.useUpdateTimeSpent(
    testId + ''
  )

  const updateSpentTime = () => {
    if (questionIdRef.current && !apiCalledRef.current) {
      const unmountTime = Date.now()
      const timeSpentInMs = unmountTime - mountTimeRef.current
      const timeSpentInSec = timeSpentInMs / 1000

      if (timeSpentInSec < 2) {
        accumulatedTimeRef.current += timeSpentInSec
      } else {
        const totalTimeSpent = accumulatedTimeRef.current + timeSpentInSec
        accumulatedTimeRef.current = 0
        if (!totalTimeSpent || isNaN(totalTimeSpent)) {
          return console.log('Invalid Time Spent')
        }
        // Call the API to update time spent on the question
        updateTimeSpent({
          questionId: questionIdRef.current + '',
          timeSpent: totalTimeSpent
        })

        console.log(
          `Time spent on question ${questionIdRef.current}: ${totalTimeSpent}s`
        )

        // Mark that the API call has been made for this question
        apiCalledRef.current = true
      }
    }
  }

  useEffect(
    () => {
      if (questionId !== questionIdRef.current) {
        updateSpentTime()

        // Reset for new question
        mountTimeRef.current = Date.now()
        questionIdRef.current = questionId
        apiCalledRef.current = false // Reset API call tracker
      }
    },
    [questionId, updateTimeSpent]
  )

  useEffect(() => {
    return () => {
      updateSpentTime()
    }
  }, [])

  return {}
}
