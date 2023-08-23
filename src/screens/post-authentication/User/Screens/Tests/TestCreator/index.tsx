import { Button, Card, Col, Form, Modal, Row, Spin, Tag } from 'antd'
import { Constants, Enum, Types, Utils } from '@adewaskar/lms-common'
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
import Tabs from '@Components/Tabs'
import TestInformationEditor from './TestInformation'
import TestLearners from './TestLearners/TestLearners'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal

function TestEditor() {
  const message = useMessage()
  const { id } = useParams()
  const testId = id + ''
  const [Test, setTest] = useState<Types.Test>(Constants.INITIAL_LIVE_TEST_DETAILS)

  const {
    mutate: updateTestApi,
    isLoading: loading
  } = User.Queries.useUpdateTest()

  const { data: TestDetails } = User.Queries.useGetTestDetails(
    testId,
    {
      enabled: !!testId
    }
  )

  const {
    mutate: publishTest,
    isLoading: publishingTest
  } = User.Queries.usePublishTest()

  useEffect(
    () => {
      setTest(TestDetails)
    },
    [TestDetails]
  )

  const saveTest = (e: Partial<Types.Test>) => {
    setTest({
      ...Test,
      ...e
    })
  }
  const updateTest = () => {
    updateTestApi(
      {
        id: testId,
        data: Test
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

  const validateDraftTest = () => {
    return Test.title
  }
  const navigate = useNavigate()
  return (
    <Spin spinning={publishingTest}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card
            title={
              <span>
                <BackButton
                  onClick={() => navigate(`../app/products/test`)}
                />{' '}
                {Test.title}
              </span>
            }
            extra={[
              Test.status === Enum.TestStatus.PUBLISHED ? (
                <Tag color='green'>Test is published</Tag>
              ) : (
                <Button
                  disabled={!Utils.validatePublishTest(Test)}
                  onClick={() => {
                    confirm({
                      title: 'Are you sure?',
                      content: `You want to publish this Test?`,
                      onOk() {
                        publishTest({
                          testId: Test._id+''
                        })
                      },
                      okText: 'Yes, Publish'
                    })
                  }}
                  style={{ marginRight: 15 }}
                  icon={<UploadOutlined />}
                >
                  Publish Tests
                </Button>
              ),
              <Button
                disabled={!validateDraftTest()}
                loading={loading}
                type="primary"
                onClick={updateTest}
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
                  window.open(`../${Test._id}/builder`)
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
                    <TestInformationEditor
                      saveTest={saveTest}
                      Test={Test}
                      testId={testId}
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
                  children: <TestLearners testId={Test._id+''} />
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
                  //   <TestCertificate
                  //     testId={Test._id}
                  //     Test={Test}
                  //     saveTest={saveTest}
                  //   />
                  // )
                }
              ]}
            />
          </Card>
        </Col>
        {/* <Col span={20}>
          <TestInformationEditor />
        </Col> */}
      </Row>
    </Spin>
  )
}

export default TestEditor
