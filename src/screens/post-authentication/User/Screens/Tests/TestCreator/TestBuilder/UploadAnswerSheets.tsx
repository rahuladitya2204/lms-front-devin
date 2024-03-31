import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  Modal,
  Row,
  message
} from 'antd'
import {
  CameraOutlined,
  DeleteOutlined,
  SettingOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { Common, Types, User } from '@adewaskar/lms-common'
import React, { useEffect } from 'react'

import { AppCamera } from '@Components/ActionModal/Camera/AppCamera'
import Header from '@Components/Header'
import MediaUpload from '@Components/MediaUpload'
import TestAnswerSheetProcessStatusTag from './UploadTestAnswerSheetProcessTag'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useParams } from '@Router/index'

const { confirm } = Modal
export default function UploadAnswerSheets() {
  const { testId } = useParams()
  const { data: test, isLoading: loadingTest } = User.Queries.useGetTestDetails(
    testId + ''
  )
  const [form] = Form.useForm()

  useEffect(
    () => {
      if (test._id) {
        form.setFieldsValue(test)
      }
    },
    [test]
  )

  const handleDelete = (index: number) => {
    // Logic to delete the image from the state or backend
    // Assuming answerSheets is a state variable that you update accordingly
    const answerSheets = form.getFieldValue('answerSheets') || []
    // @ts-ignore
    const updatedAnswerSheets = answerSheets.filter((_, i) => i !== index)
    form.setFieldsValue({ answerSheets: updatedAnswerSheets })
    message.success('File deleted successfully')
  }
  const answerSheets = Form.useWatch(['answerSheets'], form)
  const {
    mutate: updateTestAnswerSheets,
    isLoading: updating
  } = User.Queries.useUpdateTestAnswerSheets(testId + '')
  const submit = ({
    answerSheets
  }: {
    answerSheets: Types.TestAnswerSheet[]
  }) => {
    updateTestAnswerSheets(
      {
        answerSheets
      },
      {
        onSuccess: () => {
          message.success('Saved Successfully')
        }
      }
    )
  }
  const { openModal } = useModal()
  const {
    mutate: processAnswerSheets,
    isLoading: processingAnswerSheets
  } = User.Queries.useProcessAnswerSheets(testId + '')
  const { isMobile } = useBreakpoint()
  const {
    mutate: uploadFiles,
    isLoading: uploadingFile
  } = Common.Queries.useUploadFiles()
  return (
    <Header
      title={`${test?.title || 'Upload Answer Sheets'}`}
      extra={[
        <Dropdown.Button
          type="primary"
          menu={{
            items: [
              {
                label: 'Process Answer Sheets',
                icon: <SettingOutlined />,
                key: 'process-answer-sheet',
                onClick: () => processAnswerSheets()
              }
            ]
          }}
          onClick={form.submit}
          loading={updating || processingAnswerSheets}
        >
          Save Changes
        </Dropdown.Button>
        // <Button
        //   onClick={() => processAnswerSheets()}
        //   loading={processingAnswerSheets}
        //   type="primary"
        // >
        //   Process Answer Sheets
        // </Button>
      ]}
    >
      <Form onFinish={submit} form={form} initialValues={{ answerSheets: [] }}>
        <Row>
          <Col span={24}>
            <Card
              style={{ minHeight: '80vh' }}
              loading={loadingTest}
              title="Upload Answer Sheets"
              extra={
                isMobile ? (
                  <Button
                    loading={uploadingFile}
                    onClick={() =>
                      openModal(
                        <AppCamera
                          onClickPhoto={(files: any[]) => {
                            uploadFiles({
                              files: files.map(f => {
                                return {
                                  file: f
                                }
                              }),
                              onSuccess: files => {
                                console.log('Uploaded Files', files)
                                const answerSheets =
                                  form.getFieldValue('answerSheets') || []
                                const newAnswerSheets = files.map(file => {
                                  return {
                                    url: file.url,
                                    // pageNo: answerSheets.length + 1,
                                    responses: [] // Assuming initial responses are empty
                                  }
                                })
                                form.setFieldsValue({
                                  answerSheets: [
                                    ...answerSheets,
                                    ...newAnswerSheets
                                  ]
                                })
                              }
                            })
                          }}
                        />,
                        {
                          fullScreen: true
                        }
                      )
                    }
                    type="primary"
                    icon={<CameraOutlined />}
                  >
                    Click Photo
                  </Button>
                ) : (
                  <MediaUpload
                    compress={{ maxWidth: 1240, maxHeight: 1754, quality: 1 }}
                    aspect={210 / 297}
                    multiple
                    uploadType="image"
                    renderItem={() => (
                      <Button icon={<UploadOutlined />}>Upload Files</Button>
                    )}
                    onUpload={(files: Types.FileType[]) => {
                      const answerSheets =
                        form.getFieldValue('answerSheets') || []
                      const newAnswerSheets = files.map(file => {
                        return {
                          url: file.url,
                          // pageNo: answerSheets.length + 1,
                          responses: [] // Assuming initial responses are empty
                        }
                      })
                      form.setFieldsValue({
                        answerSheets: [...answerSheets, ...newAnswerSheets]
                      })
                    }}
                  />
                )
              }
            >
              <Form.List name="answerSheets">
                {(fields, { remove }) => (
                  <Row gutter={[20, 30]} align={'middle'}>
                    {fields.map(({ key, name, fieldKey }) => (
                      <Col key={key} xs={24} sm={12} md={6} lg={4}>
                        <Row>
                          {/* <Col span={24}>
                            <TestAnswerSheetProcessStatusTag
                              answerSheet={answerSheets[key]}
                            />
                          </Col> */}
                          <Col span={24}>
                            <Form.Item
                              name={[name, 'url']}
                              fieldKey={[key, 'url']}
                              noStyle
                            >
                              <Image
                                src={answerSheets[key]?.url}
                                width={100}
                                style={{ marginBottom: 8 }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <TestAnswerSheetProcessStatusTag
                              answerSheet={answerSheets[key]}
                            />
                          </Col>
                          <Col span={24}>
                            <Button
                              style={{ width: 100 }}
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                confirm({
                                  title: `Are you sure`,
                                  // icon: <ExclamationCircleOutlined />,
                                  content: `You want to delete this image`,
                                  onOk() {
                                    handleDelete(name)
                                  },
                                  okText: 'Delete'
                                })
                              }}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    ))}
                  </Row>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>
      </Form>
    </Header>
  )
}
