"use client";
import { Button, Result } from "@Lib/index";
import { useNavigate, useParams } from "@Router/index";

import { Learner } from "@adewaskar/lms-common";
import ReviewTest from "./TestFeedback/ReviewTest";

export default function TestCompleted() {
  const { testId } = useParams();
  const { data: test } = Learner.Queries.useGetTestDetails(testId + "");
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      // title="Thank you for completing the test"
      //   subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      // extra={[
      //   <Button
      //     onClick={() => {
      //       navigate('../')
      //     }}
      //     type="primary"
      //     key="console"
      //   >
      //     Go Home {`:-)`}
      //   </Button>
      // ]}
    >
      <ReviewTest
        onSubmit={() => {
          if (!test.live.enabled) {
            return navigate(`/app/test/${testId}/result`);
          }
          navigate(`/app/test/${testId}`);
        }}
        testId={testId + ""}
      />
    </Result>
  );
}
