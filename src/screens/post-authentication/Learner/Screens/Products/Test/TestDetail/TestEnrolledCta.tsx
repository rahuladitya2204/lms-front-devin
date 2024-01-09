import { Alert, Button, Skeleton } from "antd";
import { Enum, Learner } from "@adewaskar/lms-common";
import { Fragment, useMemo } from "react";

import Countdown from "@Components/Countdown";
import TestTimeCountdown from "@Components/TestTimeCountdown";
import { useNavigate } from "react-router";

interface TestEnrolledCtaPropsI {
    testId: string;
}

export default function TestEnrolledCta(props: TestEnrolledCtaPropsI) {
    const { testId } = props;
    const { data: test, isLoading: loadingTest } = Learner.Queries.useGetTestDetails(testId + '','');
    const navigate =useNavigate();
    const {
        data: enrolledDetails,
        isLoading: loadingEnrolledTestDetails
    } = Learner.Queries.useGetEnrolledProductDetails({
        type: Enum.ProductType.TEST,
        id: props.testId
    });
    const { data: { status }, isLoading: loadingResult } = Learner.Queries.useGetTestResult(testId, {
        enabled: !!(enrolledDetails?.metadata?.test.endedAt)
    });
    const testEndDate = enrolledDetails.metadata.test.endedAt || test.live.endedAt;
    const testStartDate =
      enrolledDetails.metadata.test.startedAt || test.live.startedAt;
      if (test.live.enabled) {
        if (testEndDate) {
          return <Alert
          style={{ marginBottom: 20 }}
          message={`Your test was submitted successfully` }
          type="success"
          showIcon
        />
        }
        switch (test.status) {
  
          case Enum.TestStatus.PUBLISHED: {
            return <Alert
            style={{ marginBottom: 20 }}
            message={<span>Test will begin in <Countdown targetDate={test.live.scheduledAt} /></span>}
            type="success"
            showIcon
          />
            break;
          }
            
          case Enum.TestStatus.IN_PROGRESS: {
    return <Fragment>
              <Alert
              style={{ marginBottom: 20 }}
              message="Test has started" action={<span>Time left: <TestTimeCountdown testId={testId} /> </span>}
              type='info'
                showIcon
                // action={ }
            />
               <Button size="large" onClick={() => navigate('start')} block type='primary'>
              Join Test
            </Button>
            </Fragment>
            break;
          }
            
          case Enum.TestStatus.ENDED: {
            return <Alert
              style={{ marginBottom: 20 }}
              message="The test has ended"
              type='error'
              showIcon
            />
            break;
          }
        }
      }
      else {
        // console.log(enrolledDetails.metadata.test, 'enrolledDetails')
        if (!testStartDate) {
          return <Button size='large' onClick={() => navigate('start')} block type='primary'>
            Start Test
          </Button>
        }
        if ((testStartDate)) {
          if (testEndDate) {
            if (status === Enum.TestResultStatus.EVALUATED) {
              return <>
              <Alert
                style={{ marginBottom: 20 }}
                message="You have attended this test."
                type="success"
                showIcon action={<Button size='small' onClick={() => navigate('result')}>View Result</Button>}
                />
              <Button size="large" onClick={()=>navigate('result/review')} type='primary' block>View solutions</Button>
              </>
            }
            else {
              return <>
              <Alert
                style={{ marginBottom: 20 }}
                message="Test result is under evaluation"
                type="success"
                  showIcon
                />
              </>
          }
          }
          else {
            return <Button size="large" onClick={() => navigate('start')} block type='primary'>
              Continue Test
            </Button>
          }
        }
       
      }
  
  return null;

}