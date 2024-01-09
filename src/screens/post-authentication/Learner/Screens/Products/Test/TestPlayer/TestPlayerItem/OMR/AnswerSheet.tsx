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
import React, { useEffect } from 'react'
import { Text, Title } from '@Components/Typography/Typography'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal'
import AnswerSheetFiles from './AnswerSheetFiles'
import AppImage from '@Components/Image'
import Header from '@Components/Header'
import LearnerLogin from '@Learner/Screens/Login'
import OMRComponent from './OMRComponent'
import ProductCheckoutButton from '@Components/CheckoutButton'
import { ReloadOutlined } from '@ant-design/icons'
import TestEnrolledCta from '../../../TestDetail/TestEnrolledCta'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'

const confirm = Modal.confirm

interface OMRComponentPropsI {
  testId?: string;
  closeModal?: Function;
}

const AnswerSheet: React.FC<OMRComponentPropsI> = ({
  testId: TEST_ID,
  closeModal
}) => {
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
  const { data: { status }, isFetching: loadingResult } = Learner.Queries.useGetTestResult(testId, {
    enabled: !!(ep?.metadata?.test.endedAt)
});
  const message = useMessage();
  const { data: learner, isLoading: loadingLearner } = Learner.Queries.useGetLearnerDetails();
  const isSignedIn = !!learner._id;
  const {
    mutate: startTest,
    isLoading: startingTest
  } = Learner.Queries.useStartTest(testId + '')
  const allLoading = loadingTest || loadingLearner || loadingEnrolledProduct || loadingResult;
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
                navigate(`../result`)
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
  const SkelArray = [1, 1, 1, 1, 1, 1, 1, 1, 1,1,1 ,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  if (allLoading) {
    return <Row style={{marginTop:30}}>
            <Col xs={0} sm={0} md={2} />
      <Col xs={24} sm={24} md={20}>
      <Row gutter={[20, 30]}>
    <Col span={24}>
      <Skeleton.Button active block size='large' />
    </Col>
    <Col span={24}>
      <Card title={ <Skeleton.Button style={{height:15,width:15}} active block size='large' />}>
        <Row gutter={[30,20]}>
         {SkelArray.map(()=> <Col span={12}>
            <Row justify={'space-between'}>
              {/* <Col>
                <Skeleton.Button style={{width:20,height: 20}} shape='circle' />
              </Col> */}
              <Col>
                <Row gutter={[30,20]}>
                  {SkelArray.map(()=><Col>
                  <Skeleton.Avatar active style={{width:20,height: 20}} shape='circle' />
                  </Col>)}
                </Row>
              </Col>
            </Row>
          </Col>)}
        </Row>
      </Card>
    </Col>
  </Row>
      </Col>
      <Col xs={0} sm={0} md={2} />

    </Row>
  
  }
  return (
    <Header title={test.title}>
       {isSignedIn?<Row>
      <Col xs={0} sm={0} md={2} />
      <Col xs={24} sm={24} md={20}>
      <>
          {isSignedIn ? <div >
          {isEnrolled?(
         (ep?.metadata?.test?.startedAt)? <>
                {!(ep?.metadata.test.endedAt) ? <Card title='Answer Sheet'>
                  <OMRComponent testId={testId} />
                  <Divider />
                  <Row justify={'space-between'}>
                    <Col flex={1}>
                      <Alert action={!isMobile ? SubmitTestButton : null} style={{ marginBottom: 10, marginRight: 10 }} message="Once submitted, you won't be able to resubmit, Please double check your answers." type="error" showIcon />
                    </Col>
                    {isMobile ? <Col xs={isMobile ? 24 : ''}>
                      {SubmitTestButton}</Col> : null}
                  </Row>
                </Card> : <Card>
                    <Row>
                      <Col span={24}>
                      <TestEnrolledCta testId={testId} />
                      </Col>
                </Row>
                </Card>}
            </> : <Button block type='primary' onClick={() => {
                 confirm({
                  title: 'Are you sure?',
                  // icon: <ExclamationCircleOutlined />,
                  content: `You want to start the test`,
                  onOk() {
                    startTest(
                      {
                        testId: test._id + '',
                        language: `eng`
                      },
                      {
                        onSuccess: () => {
                          message.open({
                            type: 'success',
                            content:'Test has been started'
                          })
                          // navigate('../player')
                        }
                      }
                    )      
                  },
                  okText: 'Start Test'
                })
                
   }} loading={startingTest} size='large'>Start Test</Button>
        ) : <Card>
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
              <ProductCheckoutButton onSuccess={() => {
          // message.open({
          //   type: 'success',
          //   content: `You have enrolled successfully`,
          //   particle: true
                      // })      
                      startTest(
                        {
                          testId: test._id + '',
                          language: `eng`
                        },
                        {
                          onSuccess: () => {
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
            </div> : (
          <Card>
            <Button
              onClick={() =>
                openModal(<LearnerLogin />, {
                  width: 300
                })
              }
              block
              type="primary"
              size="large"
            >
              Please Login to fill Answer Sheet
            </Button>
          </Card>
            )}
          </>
      </Col>
      <Col xs={0} sm={0} md={2}>
        {' '}
      </Col>
      </Row> : <Row justify={'center'} align={'middle'}>
        <Col>
            <Card style={{width:300}} >
            <LearnerLogin />
         </Card>
        </Col></Row>}
   </Header>
  )
}

export default AnswerSheet
