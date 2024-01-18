import { Alert, Button, Card, Col, Divider, Row } from 'antd'
import { Enum, User } from '@adewaskar/lms-common'
import OMRComponent, {
  OMRSKeleton
} from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent'

import ActionModal from '@Components/ActionModal/ActionModal'
import AnswerSheetFiles from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/AnswerSheetFiles'
import { openWindow } from '@Components/SunEditor/utils'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useEffect } from 'react'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

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
  const { isMobile } = useBreakpoint()
  const { openModal } = useModal()
  const qc = useQueryClient()
  return (
    <Card>
      {loadingEp ? (
        <OMRSKeleton />
      ) : (
        <Row>
          <Col span={24}>
            <Button
              onClick={() => {
                if (isMobile) {
                  openWindow(
                    `/app/test/${testId}/answer-sheet/${
                      learnerId
                    }/upload-answer-sheet`,
                    (refetchTestStatus: boolean) => {
                      if (refetchTestStatus) {
                        message.open({
                          type: 'success',
                          content: `Answer Sheet Recorded successfully`
                        })
                        qc.invalidateQueries([
                          `GET_TEST_STATUS`,
                          testId,
                          learnerId
                        ])
                      }
                    }
                  )
                } else {
                  openModal(
                    <AnswerSheetFiles
                      learnerId={learnerId}
                      testId={testId}
                      type="user"
                    />,
                    {
                      title: 'Answer Sheet'
                    }
                  )
                }
              }}
              block={isMobile}
              type="primary"
            >
              Show Files
            </Button>
          </Col>
          <Divider />
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
