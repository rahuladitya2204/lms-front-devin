import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerFullPageHolder from "@Screens/LearnerFullPageHolder";

import dynamic from "next/dynamic";

const TestMetrics = dynamic(
  () => import("@Learner/Screens/Products/Test/TestResult/TestMetrics"),
  { ssr: false }
);

export default function Page({
  params,
  children,
}: {
  params: { testId: string; questionId: string };
  children: React.ReactNode;
}) {
  const { getOrgDetails, getLearnerDetails } = Learner.Queries.Definitions;
  console.log(params, "questionIdquestionId");
  return children;
}
