import { Learner, Constants } from "@adewaskar/lms-common";
import { useParams } from "@Router/index";

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

  return {
    currentQuestion,
    currentQuestionIndex,
    loading: isFetching,
  };
}
