import { Alert, Button, Col, Row } from 'antd'
import { Enum, User } from '@adewaskar/lms-common'
import OMRComponent, {
  OMRSKeleton
} from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent'

import ActionModal from '@Components/ActionModal/ActionModal'
import AnswerSheetFiles from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/AnswerSheetFiles'
import { useEffect } from 'react'
import useMessage from '@Hooks/useMessage'

interface TestAnswerSheetPropsI {
  testId: string;
  learnerId: string;
}

export default function TestAnswerSheet(props: TestAnswerSheetPropsI) {
  const {
    data: ep,
    mutate: getEp,
    isLoading: loadingEp
  } = User.Queries.useGetEnrolledLearnerProductDetails(props.testId)
  const message = useMessage()
  const {
    mutate: evaluateLearnerTest,
    isLoading: evaluatingResult
  } = User.Queries.useEvaluateLearnerTest(props.testId + '')
  useEffect(
    () => {
      getEp({ learnerId: props.learnerId })
    },
    [props.testId]
  )
  return loadingEp ? (
    <OMRSKeleton />
  ) : (
    <Row>
      <Col>
        <ActionModal cta={<Button type="primary">Show Files</Button>}>
          <AnswerSheetFiles
            learnerId={props.learnerId}
            testId={props.testId}
            type="user"
          />
        </ActionModal>
      </Col>
      <Col span={24}>
        <OMRComponent
          //   readonly
          learnerId={props.learnerId}
          type="user"
          testId={props.testId + ''}
        />
      </Col>
      <Col span={24}>
        {ep?.metadata.test.result.status ? (
          <Alert
            type="error"
            message="Please note on modifying answer, you need to manually re-evaluate"
            action={
              <Button
                loading={evaluatingResult}
                onClick={() => {
                  evaluateLearnerTest(
                    {
                      learnerId: props.learnerId
                    },
                    {
                      onSuccess: () => {
                        message.open({
                          type: 'success',
                          content: 'Evaluation Initiated'
                        })
                      }
                    }
                  )
                }}
                danger
              >
                Re-Evaluate Test
              </Button>
            }
          />
        ) : null}
      </Col>
    </Row>
  )
}
