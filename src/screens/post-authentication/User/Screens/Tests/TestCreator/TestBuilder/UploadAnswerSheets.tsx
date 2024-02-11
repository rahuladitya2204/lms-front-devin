import { Button, Card, Col, Form, Image, Row, message } from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { Types, User } from '@adewaskar/lms-common'

import Header from '@Components/Header'
import MediaUpload from '@Components/MediaUpload'
import { useParams } from 'react-router'

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
  return (
    <Header
      title={`${test?.title || 'Upload Answer Sheets'}`}
      extra={[
        <Button onClick={form.submit} loading={updating} type="primary">
          Save Changes
        </Button>
      ]}
    >
      <Form onFinish={submit} form={form} initialValues={{ answerSheets: [] }}>
        <Row>
          <Col span={24}>
            <Card
              loading={loadingTest}
              title="Upload Answer Sheets"
              extra={
                <MediaUpload
                  compress={{ maxWidth: 1240, maxHeight: 1754, quality: 1 }}
                  aspect={210 / 297}
                  multiple
                  uploadType="image"
                  renderItem={() => (
                    <Button icon={<UploadOutlined />}>Upload Files</Button>
                  )}
                  onUpload={([file]: Types.FileType[]) => {
                    const answerSheets =
                      form.getFieldValue('answerSheets') || []
                    const newAnswerSheets = {
                      url: file.url,
                      // pageNo: answerSheets.length + 1,
                      responses: [] // Assuming initial responses are empty
                    }
                    form.setFieldsValue({
                      answerSheets: [...answerSheets, newAnswerSheets]
                    })
                  }}
                />
              }
            >
              <Form.List name="answerSheets">
                {(fields, { remove }) => (
                  <Row gutter={16}>
                    {fields.map(({ key, name, fieldKey }) => (
                      <Col key={key} span={4}>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name={[name, 'url']}
                              fieldKey={[key, 'url']}
                              noStyle
                            >
                              <Image
                                src={answerSheets[key].url}
                                width={100}
                                style={{ marginBottom: 8 }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Button
                              style={{ width: 100 }}
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                handleDelete(name)
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
