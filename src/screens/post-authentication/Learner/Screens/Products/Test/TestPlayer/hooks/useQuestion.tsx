import { Constants, Learner, Store, Types } from "@adewaskar/lms-common";

import { useMemo } from "react";
import { useParams } from "@Router/index";

export default function useQuestion() {
  const { questionId, testId } = useParams();
  const {
    data: {
      status: { sections },
    },
  } = Learner.Queries.useGetTestStatus(testId + "");
  // @ts-ignore
  const questions = sections.map((e) => e.items).flat();
  const currentQuestionIndex = useMemo(() => {
    return questions.findIndex((q) => q._id === questionId);
  }, [questions, questionId]);

  const currentQuestion: Types.TestStatusQuestion = useMemo(() => {
    if (currentQuestionIndex >= 0 && questions[currentQuestionIndex]) {
      return questions[currentQuestionIndex];
    }
    // Only return INITIAL_TEST_QUESTION if there's no valid question available
    return Constants.INITIAL_TEST_QUESTION;
  }, [currentQuestionIndex, questions]);
  // console.log(currentQuestion, "sections");
  const currentSection: Types.TestSection = useMemo(() => {
    if (currentQuestionIndex >= 0) {
      let questionCount = 0;
      for (let i = 0; i < sections.length; i++) {
        questionCount += sections[i].items.length;
        if (currentQuestionIndex < questionCount) {
          return sections[i];
        }
      }
    }
    return null;
  }, [currentQuestionIndex, sections]);
  return {
    currentQuestion,
    currentQuestionIndex,
    currentSection,
    loading: false,
    totalQuestionCount: questions.length,
  };
}
