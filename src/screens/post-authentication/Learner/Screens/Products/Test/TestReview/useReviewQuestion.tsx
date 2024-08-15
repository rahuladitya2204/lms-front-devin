import { Learner, Constants, Types } from "@adewaskar/lms-common";
import { useParams } from "@Router/index";
import { useMemo } from "react";

export function useReviewQuestion(d?: { testId: string; questionId: string }) {
  const params = useParams();
  const testId = d?.testId || params.testId;
  const questionId = d?.questionId || params.questionId;
  const {
    data: {
      test: { sections },
    },
    isFetching,
  } = Learner.Queries.useGetTestResult(testId + "");
  const questions = sections.map((e) => e.items).flat();
  const currentQuestionIndex: number = questions.findIndex(
    (q) => q._id === questionId
  );
  const currentQuestion = questions[currentQuestionIndex] || {
    ...Constants.INITIAL_TEST_QUESTION,
    feedback: {
      met: "",
      notMet: "",
    },
  };

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
    loading: isFetching,
  };
}
