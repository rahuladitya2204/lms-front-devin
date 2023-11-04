import { useEffect, useRef, useState } from 'react';

import { Learner } from '@adewaskar/lms-common';
import { useParams } from 'react-router-dom';

export const useTestItemTime = () => {
  const { questionId, testId } = useParams();
  const mountTimeRef = useRef(Date.now());
  const questionIdRef = useRef(questionId);
  const accumulatedTimeRef = useRef(0);
  const apiCalledRef = useRef(false);
  const {
    mutate: updateTimeSpent,
    isLoading,
  } = Learner.Queries.useUpdateTestItemTimeSpent();

  const updateSpentTime = () => {
    if (questionIdRef.current && !apiCalledRef.current) {
      const unmountTime = Date.now();
      const timeSpentInMs = unmountTime - mountTimeRef.current;
      const timeSpentInSec = timeSpentInMs / 1000;

      if (timeSpentInSec < 2) {
        accumulatedTimeRef.current += timeSpentInSec;
      } else {
        const totalTimeSpent = accumulatedTimeRef.current + timeSpentInSec;
        accumulatedTimeRef.current = 0;

        // Call the API to update time spent on the question
        updateTimeSpent({
          testId: testId + '',
          itemId: questionIdRef.current + '',
          timeSpent: totalTimeSpent,
        });

        console.log(
          `Time spent on question ${questionIdRef.current}: ${totalTimeSpent}s`
        );

        // Mark that the API call has been made for this question
        apiCalledRef.current = true;
      }
    }
  };

  useEffect(() => {
    if (questionId !== questionIdRef.current) {
      if (!isLoading) {
        updateSpentTime();
      }

      // Reset for new question
      mountTimeRef.current = Date.now();
      questionIdRef.current = questionId;
      apiCalledRef.current = false;  // Reset API call tracker
    }
  }, [questionId, updateTimeSpent, isLoading]);

  useEffect(() => {
    return () => {
      if (!isLoading) {
        updateSpentTime();
      }
    };
  }, [isLoading]);

  return {};
};
