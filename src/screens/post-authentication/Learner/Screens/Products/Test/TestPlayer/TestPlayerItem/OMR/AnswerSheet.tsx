import {
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
  Typography
} from 'antd'
import { Enum, Learner, Store } from '@adewaskar/lms-common'
import React, { useEffect } from 'react'
import { Text, Title } from '@Components/Typography/Typography'

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
import { useParams } from 'react-router'

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
  const { data: test } = Learner.Queries.useGetTestDetails(
    testId,
    Enum.TestDetailMode.TEST
  )
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct({
    type: Enum.ProductType.TEST,
    id: testId
  })
  const message = useMessage();
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)
  const { openModal } = useModal()
  const { isMobile } = useBreakpoint()

  return (
    <Row>
      <Col xs={0} sm={0} md={2} />
      <Col xs={24} sm={24} md={20}>
            {isSignedIn ? (isEnrolled?(
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
        </Card>) : (
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
