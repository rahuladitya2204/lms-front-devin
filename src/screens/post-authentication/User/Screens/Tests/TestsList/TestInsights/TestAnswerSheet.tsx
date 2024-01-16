import { Alert, Button, Card, Col, Row } from 'antd'
import { Enum, User } from '@adewaskar/lms-common'
import OMRComponent, {
  OMRSKeleton
} from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent'

import ActionModal from '@Components/ActionModal/ActionModal'
import AnswerSheetFiles from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/AnswerSheetFiles'
import { useEffect } from 'react'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

interface TestAnswerSheetPropsI {
  testId?: string;
  learnerId?: string;
}

export default function TestAnswerSheet(props: TestAnswerSheetPropsI) {
  const params = useParams()
  const testId = (props.testId || params.testId) + ''
  const learnerId = (props.learnerId || params.learnerId) + ''
  const {
    data: ep,
    mutate: getEp,
    isLoading: loadingEp
  } = User.Queries.useGetEnrolledLearnerProductDetails(testId)
  const message = useMessage()
  const {
    mutate: evaluateLearnerTest,
    isLoading: evaluatingResult
  } = User.Queries.useEvaluateLearnerTest(testId + '')
  useEffect(
    () => {
      getEp({ learnerId: learnerId })
    },
    [testId]
  )
  return (
    <Card>
      {loadingEp ? (
        <OMRSKeleton />
      ) : (
        <Row>
          <Col>
            <ActionModal cta={<Button type="primary">Show Files</Button>}>
              <AnswerSheetFiles
                learnerId={learnerId}
                testId={testId}
                type="user"
              />
            </ActionModal>
          </Col>
          <Col span={24}>
            <OMRComponent
              //   readonly
              learnerId={learnerId}
              type="user"
              testId={testId + ''}
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
                          learnerId: learnerId
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
      )}
    </Card>
  )
}
