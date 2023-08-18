import { Button, Card, Col, Form, Modal, Row, Spin } from 'antd'
import { Constants, Types, Utils } from '@adewaskar/lms-common'
import {
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import BackButton from '@Components/BackButton'
import LiveTestInformationEditor from './LiveTestInformation'
import LiveTestLearners from './LiveTestLearners/LiveTestLearners'
import Tabs from '@Components/Tabs'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal

function LiveTestEditor() {
  const message = useMessage()
  const { id } = useParams()
  const liveTestId = id + ''
  const [liveTest, setLiveTest] = useState(Constants.INITIAL_LIVE_TEST_DETAILS)

  const {
    mutate: updateLiveTestApi,
    isLoading: loading
  } = User.Queries.useUpdateLiveTest()

  const { data: liveTestDetails } = User.Queries.useGetLiveTestDetails(
    liveTestId,
    {
      enabled: !!liveTestId
    }
  )

  const {
    mutate: publishLiveTest,
    isLoading: publishingLiveTest
  } = User.Queries.usePublishLiveTest()

  useEffect(
    () => {
      setLiveTest(liveTestDetails)
    },
    [liveTestDetails]
  )

  const saveLiveTest = (e: Partial<Types.LiveTest>) => {
    setLiveTest({
      ...liveTest,
      ...e
    })
  }
  const updateLiveTest = () => {
    updateLiveTestApi(
      {
        id: liveTestId,
        data: liveTest
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved'
          })
        }
      }
    )
  }

  const validateDraftLiveTest = () => {
    return liveTest.title
  }
  const navigate = useNavigate()
  return (
    <Spin spinning={publishingLiveTest}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card
            title={
              <span>
                <BackButton
                  onClick={() =>
                    navigate(`../app/products/live-test`)
                  }
                />{' '}
                {liveTest.title}
              </span>
            }
            extra={[
              <Button
                disabled={!Utils.validatePublishLiveTest(liveTest)}
                onClick={() => {
                  confirm({
                    title: 'Are you sure?',
                    content: `You want to publish this liveTest?`,
                    onOk() {
                      publishLiveTest({
                        liveTestId: liveTest._id
                      })
                    },
                    okText: 'Yes, Publish'
                  })
                }}
                style={{ marginRight: 15 }}
                icon={<UploadOutlined />}
              >
                Publish Live Test
              </Button>,
              <Button
                disabled={!validateDraftLiveTest()}
                loading={loading}
                type="primary"
                onClick={updateLiveTest}
                icon={<SaveOutlined />}
              >
                Save as draft
              </Button>
            ]}
          >
            <Tabs
              navigateWithHash
              onTabClick={e => {
                if (e === 'builder') {
                  window.open(`../${liveTest._id}/builder`)
                }
              }}
              tabPosition={'left'}
              style={{ minHeight: '100vh' }}
              items={[
                {
                  label: (
                    <span>
                      <InfoCircleOutlined />Information
                    </span>
                  ),
                  key: 'information',
                  children: (
                    <LiveTestInformationEditor
                      saveLiveTest={saveLiveTest}
                      liveTest={liveTest}
                      liveTestId={liveTestId}
                    />
                  )
                },
                // {
                //   label: (
                //     <span>
                //       <ToolOutlined />Builder
                //     </span>
                //   ),
                //   key: 'builder'
                // },
                {
                  label: (
                    <span>
                      <UserOutlined />Learners
                    </span>
                  ),
                  key: 'learners',
                  children: <LiveTestLearners liveTestId={liveTest._id} />
                },
                {
                  label: (
                    <span>
                      <SafetyCertificateOutlined />Certificate
                    </span>
                  ),
                  key: 'certificate',
                  children: null
                  //   (
                  //   <LiveTestCertificate
                  //     liveTestId={liveTest._id}
                  //     liveTest={liveTest}
                  //     saveLiveTest={saveLiveTest}
                  //   />
                  // )
                }
              ]}
            />
          </Card>
        </Col>
        {/* <Col span={20}>
          <LiveTestInformationEditor />
        </Col> */}
      </Row>
    </Spin>
  )
}

export default LiveTestEditor
