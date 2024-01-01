import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
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
import LearnerLogin from '@Learner/Screens/Login'
import OMRComponent from './OMRComponent'
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
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)
  const { openModal } = useModal()
  return (
    <Row>
      <Col xs={0} sm={0} md={2} />
      <Col xs={24} sm={24} md={20}>
        <Card title={<Text>Answer Sheet: {test.title}</Text>}>
          {isSignedIn ? (
            <OMRComponent testId={testId} />
          ) : (
            <div>
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
              {/* <ActionModal
                width={300}
                cta={
                  <Button block type="primary" size="large">
                    Please Login to fill Answer Sheet
                  </Button>
                }
              >
                <LearnerLogin />
              </ActionModal> */}
            </div>
          )}
        </Card>
      </Col>
      <Col xs={0} sm={0} md={2}>
        {' '}
      </Col>
    </Row>
  )
}

export default AnswerSheet
