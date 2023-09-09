import { Button, Card, Col, Form, Modal, Row, Skeleton, Spin, Tag } from 'antd'
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
  const [test, setTest] = useState<Types.Test>(Constants.INITIAL_LIVE_TEST_DETAILS)

  const {
    mutate: updateTestApi,
    isLoading: loading
  } = User.Queries.useUpdateTest()

  const { data: testDetails ,isLoading: loadingTest} = User.Queries.useGetTestDetails(
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
      setTest(testDetails)
    },
    [testDetails]
  )

  const saveTest = (e: Partial<Types.Test>) => {
    setTest({
      ...test,
      ...e
    })
  }
  const updateTest = () => {
    updateTestApi(
      {
        id: testId,
        data: test
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
    return test.title
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
                {test.title}
              </span>
            }
            extra={[
              test.status === Enum.TestStatus.PUBLISHED ? (
                <Tag color='green'>Test is published</Tag>
              ) : (
                <Button
                  disabled={!Utils.validatePublishTest(test)}
                  onClick={() => {
                    confirm({
                      title: 'Are you sure?',
                      content: `You want to publish this Test?`,
                      onOk() {
                        publishTest({
                          testId: test._id+''
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
            {loadingTest ? <>
              <Row gutter={[20,20]}>
                <Col span={2}>
                  <Row style={{marginTop:20}}>
                    <Col span={24}>
                    <Skeleton.Button active block/>
                    </Col>
                  </Row>
                  <Row style={{marginTop:20}}>
                    <Col span={24}>
                    <Skeleton.Button active block/>
                    </Col>
                  </Row>
                  <Row style={{marginTop:20}}>
                    <Col span={24}>
                    <Skeleton.Button active block/>
                    </Col>
                 </Row>
                </Col>
                <Col span={22}>
                  <Row gutter={[20,20]}>
                    <Col><Skeleton.Button active/></Col>
                    <Col><Skeleton.Button active/></Col>
                    <Col><Skeleton.Button active/></Col>
                  </Row>
                  <Row style={{ marginTop: 30 }} gutter={[20, 40]}>
                    <Col span={24}>
                      <Skeleton.Image active />
                    </Col>
                    <Col span={24}>
                      <Skeleton.Input active block/>
                    </Col>
                    <Col span={24}>
                      <Skeleton.Input active block/>
                    </Col>
                    <Col span={24}>
                      <Skeleton.Input active block/>
                    </Col>
                    <Col span={24}>
                      <Skeleton.Input active block/>
                    </Col>
                    <Col span={24}>
                      <Skeleton.Input active block/>
                    </Col>
                    <Col span={24}>
                      <Skeleton.Input active block/>
                    </Col>
                    <Col span={24}>
                      <Skeleton.Input active block/>
                    </Col>
                  </Row>
                </Col>
              </Row></>:<Tabs
              navigateWithHash
              onTabClick={e => {
                if (e === 'builder') {
                  window.open(`../${test._id}/builder`)
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
                      test={test}
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
                  children: <TestLearners testId={test._id+''} />
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
                  //     testId={test._id}
                  //     test={test}
                  //     saveTest={saveTest}
                  //   />
                  // )
                }
              ]}
            />}
            
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
