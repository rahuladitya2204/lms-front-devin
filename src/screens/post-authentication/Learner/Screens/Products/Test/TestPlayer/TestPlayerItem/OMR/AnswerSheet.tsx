import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Image,
  Modal,
  Radio,
  Row,
  Skeleton,
  Space,
  Spin,
  Typography
} from 'antd'
import { Enum, Learner, Store } from '@adewaskar/lms-common'
import OMRComponent, { OMRSKeleton } from './OMRComponent'
import React, { useEffect } from 'react'
import { Text, Title } from '@Components/Typography/Typography'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal'
import AppImage from '@Components/Image'
import Header from '@Components/Header'
import LearnerLogin from '@Learner/Screens/Login'
import ProductCheckoutButton from '@Components/CheckoutButton'
import { ReloadOutlined } from '@ant-design/icons'
import TestEnrolledCta from '../../../TestDetail/TestEnrolledCta'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useQueryClient } from '@tanstack/react-query'

const AnswerSheetFiles = React.lazy(() => import('./AnswerSheetFiles'));

const confirm = Modal.confirm

interface OMRComponentPropsI {
  testId?: string;
  closeModal?: Function;
}

const AnswerSheet: React.FC<OMRComponentPropsI> = ({
  testId: TEST_ID,
  closeModal
}) => {
  const qc = useQueryClient();
  const params = useParams()
  const testId = (TEST_ID || params.testId) + ''
  const { data: test, isLoading: loadingTest } = Learner.Queries.useGetTestDetails(
    testId,
    Enum.TestDetailMode.TEST
  );
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct({
    type: Enum.ProductType.TEST,
    id: testId
  })
  const { isFetching: loadingEnrolledProduct,data: ep } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: testId
  });
  const { data: { status } } = Learner.Queries.useGetTestResult(testId, {
    enabled: !!(ep?.metadata?.test.endedAt)
});
  const message = useMessage();
  const {
    mutate: startTest,
    isLoading: startingTest
  } = Learner.Queries.useStartTest(testId + '')
  const allLoading = loadingTest || loadingEnrolledProduct;
  const { openModal } = useModal()
  const { isMobile } = useBreakpoint()
  const navigate = useNavigate();
  const {
    mutate: endTest,
    isLoading: submittingTest
  } = Learner.Queries.useEndTest();
  const { isDesktop } = useBreakpoint();
  const SubmitTestButton = <Button block={!isDesktop}
    onClick={() => {
      confirm({
        title: 'Are you sure?',
        // icon: <ExclamationCircleOutlined />,
        content: `You want to submit this test?`,
        onOk() {
          endTest(
            { testId: test._id + '' },
            {
              onSuccess: () => {
                message.open({
                  type: 'success',
                  content: `Test Submitted Successfully`
                });
                navigate('../completed')
              }
            }
          )
        },
        okText: 'Yes, Submit'
      })
    }}
    type="primary" danger
    loading={submittingTest}
  >
    Submit Test
  </Button>;
  if (allLoading) {
    return <OMRSKeleton/>

  }
  return (
    <Header title={test.title}>
    <Row gutter={[20,20]}>
      <Col xs={0} sm={0} md={1} />
      <Col xs={24} sm={24} md={22}>
      <>
      <div >
              {isEnrolled ? <TestEnrolledCta testId={testId} >
                <Card title='Answer Sheet'
          //         extra={<ActionModal
          //           cta={
          //             <Button
          //               // style={{ marginBottom: 15 }}
          //               // type='primary'
          //               block >Upload Answer Sheet
          //             </Button>}>
          // <AnswerSheetFiles testId={testId+''} />
          //         </ActionModal>}
                >
                  <OMRComponent testId={testId} />
                  <Divider />
                  <Row justify={'space-between'}>
                    <Col flex={1}>
                      <Alert action={!isMobile ? SubmitTestButton : null} style={{ marginBottom: 10, marginRight: 10 }} message="Once submitted, you won't be able to resubmit, Please double check your answers." type="error" showIcon />
                    </Col>
                    {isMobile ? <Col xs={isMobile ? 24 : ''}>
                      {SubmitTestButton}</Col> : null}
                  </Row>
                    </Card>
          </TestEnrolledCta> : <Card>
            <Row gutter={[20,20]}>
            <Col span={24}>
      <AppImage
        width={'100%'}
        height={200}
        preview={false}
        src={test.thumbnailImage}
      />
    </Col>
              <Col span={24}>
              <ProductCheckoutButton ctaText='Click here to enroll and fill answer sheet' onSuccess={() => {
          // message.open({
          //   type: 'success',
          //   content: `You have enrolled successfully`,
          //   particle: true
                      // })      
                      startTest(
                        {
                          language: `eng`
                        },
                        {
                          onSuccess: (rr) => {
                            console.log('STARTED TEST',rr)
                            message.open({
                              type: 'success',
                              content:'All the best!'
                            })
                            // navigate('../player')
                          }
                        }
                      )                }}
    product={{ type: 'test', id: testId + '' }}
    block
    type='primary'
  >
    {/* {isFree?'Try Now':'Buy Now'} */}
        </ProductCheckoutButton>
              </Col>
            </Row>
        </Card>}
            </div>
          </>
      </Col>
      <Col xs={0} sm={0} md={1}>
        {' '}
      </Col>
      </Row>
   </Header>
  )
}

export default AnswerSheet
