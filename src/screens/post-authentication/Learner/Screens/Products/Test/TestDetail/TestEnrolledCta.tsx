import { Alert, Button, Col, Row, Skeleton } from "@Lib/index";
import { Enum, Learner } from "@adewaskar/lms-common";
import React, { Fragment, useMemo } from "react";

import Countdown from "@Components/Countdown";
import { ReloadOutlined } from "@ant-design/icons";
import TestTimeCountdown from "@Components/TestTimeCountdown";
import { useNavigate } from "react-router";

interface TestEnrolledCtaPropsI {
  testId: string;
  children?: any;
}

export default function TestEnrolledCta(props: TestEnrolledCtaPropsI) {
  const { testId } = props;
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(testId + "");
  const { mutate: retryTest, isLoading: retryingTest } =
    Learner.Queries.useRetryTest(test._id + "");
  const navigate = useNavigate();
  const { data: enrolledDetails, isLoading: loadingEnrolledTestDetails } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: "test",
      id: props.testId,
    });
  const {
    data: { status },
    isLoading: loadingResult,
  } = Learner.Queries.useGetTestResult(testId, {
    enabled: !!enrolledDetails?.metadata?.test.endedAt,
  });
  // console.log(enrolledDetails,'enrolledDetails')
  const testEndDate =
    enrolledDetails.metadata.test.endedAt || test.live.endedAt;
  const testStartDate =
    enrolledDetails.metadata.test.startedAt || test.live.startedAt;
  //   if (loadingResult) {
  //     return <Row gutter={[20,20]}>
  //       <Col span={24}>
  //       <Skeleton.Button block style={{height:40}} />
  //       </Col>
  //       <Col span={24}>
  //       <Skeleton.Button block style={{height:40}} />
  // </Col>
  //     </Row>
  //   }
  if (test.live.enabled) {
    if (testEndDate) {
      return (
        <Alert
          style={{ marginBottom: 20 }}
          message={`Your test was submitted successfully`}
          type="success"
          showIcon
        />
      );
    }
    switch (test.status) {
      case Enum.TestStatus.PUBLISHED: {
        return (
          <Alert
            style={{ marginBottom: 20 }}
            message={
              <span>
                Test will begin in{" "}
                <Countdown targetDate={test.live.scheduledAt} />
              </span>
            }
            type="success"
            showIcon
          />
        );
        break;
      }

      case Enum.TestStatus.IN_PROGRESS: {
        return (
          <Fragment>
            <Alert
              style={{ marginBottom: 20 }}
              message="Test has started"
              action={
                <span>
                  Time left: <TestTimeCountdown testId={testId} />{" "}
                </span>
              }
              type="info"
              showIcon
              // action={ }
            />
            <Button
              size="large"
              onClick={() => navigate(`/app/test/${testId}/start`)}
              block
              type="primary"
            >
              Join Test
            </Button>
          </Fragment>
        );
        break;
      }

      case Enum.TestStatus.ENDED: {
        return (
          <Alert
            style={{ marginBottom: 20 }}
            message="The test has ended"
            type="error"
            showIcon
          />
        );
        break;
      }
    }
  } else {
    // console.log(testStartDate, 'enrolledDetails')
    if (!testStartDate) {
      return (
        <Button
          size="large"
          onClick={() => navigate(`/app/test/${testId}/start`)}
          block
          type="primary"
        >
          Start Test
        </Button>
      );
    }
    if (testStartDate) {
      if (testEndDate) {
        if (status === Enum.TestResultStatus.EVALUATED) {
          return (
            <>
              <Alert
                style={{ marginBottom: 20 }}
                message="You have attended this test."
                type="success"
                showIcon
                action={
                  <Button
                    size="small"
                    onClick={() => navigate(`/app/test/${testId}/result`)}
                  >
                    View Result
                  </Button>
                }
              />
              <Button
                size="large"
                onClick={() => navigate(`/app/test/${testId}/result/review`)}
                type="primary"
                block
              >
                View solutions
              </Button>
              <Button
                danger
                loading={retryingTest}
                size="large"
                onClick={() => retryTest()}
                type="primary"
                block
              >
                Retry Test
              </Button>
            </>
          );
        } else {
          return (
            <>
              <Alert
                style={{ marginBottom: 20 }}
                message="Test result is under evaluation"
                type="success"
                showIcon
              />
            </>
          );
        }
      } else {
        return (
          props.children || (
            <Button
              size="large"
              onClick={() => navigate(`/app/test/${testId}/start`)}
              block
              type="primary"
            >
              Continue Test
            </Button>
          )
        );
      }
    }
  }

  return props.children || <React.Fragment />;
}
