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
import LearnerLogin from '@Learner/Screens/Login'
import OMRComponent from './OMRComponent'
import ProductCheckoutButton from '@Components/CheckoutButton'
import { ReloadOutlined } from '@ant-design/icons'
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
  const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(
    testId,
    Enum.TestDetailMode.TEST
  )
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct({
    type: Enum.ProductType.TEST,
    id: testId
  })
  const { isLoading: loadingEnrolledProduct } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: testId
  });
  const message = useMessage();
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn);
  const { isLoading: loadingLearner} = Learner.Queries.useGetLearnerDetails();
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
              navigate(`../${testId}/result`)
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
</Button>
  return (
    <Row>
      <Col xs={0} sm={0} md={2} />
      <Col xs={24} sm={24} md={20}>
        {isSignedIn ? <div >
          {isEnrolled?(
          <>
                <ActionModal
          cta={
            <Button
              style={{ marginBottom: 20 }}
              block={isMobile}
              type="primary"
            >
              Upload Answer Sheet
            </Button>
          }
        >
          <AnswerSheetFiles testId={testId + ''} />
            </ActionModal>
            
           <Card title={<Text>Answer Sheet: {test.title}</Text>}>
              <OMRComponent testId={testId} />
              <Divider/>
              <Row justify={'space-between'}>
                <Col flex={1}>
                  <Alert action={!isMobile?SubmitTestButton:null} style={{marginBottom:10,marginRight:10}} message="Once submitted, you won't be able to resubmit, Please double check your answers." type="error" showIcon />
                </Col>
                {isMobile?<Col xs={isMobile?24:''}>
                {SubmitTestButton}</Col>:null}
              </Row>
            </Card>
          </> 
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
          message.open({
            type: 'success',
            content: `You have enrolled successfully`,
            particle: true
          })                            }}
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
      </Col>
      <Col xs={0} sm={0} md={2}>
        {' '}
      </Col>
    </Row>
  )
}

export default AnswerSheet
