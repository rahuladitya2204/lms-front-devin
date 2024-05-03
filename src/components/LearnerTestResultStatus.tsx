import { Enum, Learner } from "@adewaskar/lms-common";
import { Skeleton, Tag } from "antd";

import { Fragment } from "react";

interface LearnerTestResultStatusPropsI {
  testId: string;
}

export default function LearnerTestResultStatus(
  props: LearnerTestResultStatusPropsI
) {
  const {
    data: {
      status,
      metrics: { learnerScore, passingScore },
    },
    isLoading: loadingResult,
  } = Learner.Queries.useGetTestResult(props.testId + "");
  // console.log(status, 'ss')
  if (loadingResult) {
    return <Skeleton.Button style={{ width: 46, height: 22 }} active />;
  }
  return (
    <Fragment>
      {/* @ts-ignore */}
      {status === Enum.TestResultStatus.EVALUATED ? (
        learnerScore && learnerScore >= passingScore ? (
          <Tag color="green-inverse">Passed</Tag>
        ) : (
          <Tag color="red-inverse">Failed</Tag>
        )
      ) : //   @ts-ignore
      status === Enum.TestResultStatus.PENDING ? (
        <Tag color="orange-inverse">Evaluation in progres</Tag>
      ) : null}
    </Fragment>
  );
}
