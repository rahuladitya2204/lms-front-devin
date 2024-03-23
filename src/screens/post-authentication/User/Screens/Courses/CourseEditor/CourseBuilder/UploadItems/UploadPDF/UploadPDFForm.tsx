import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Upload
} from 'antd'
import { Common, User } from '@adewaskar/lms-common'
import { Fragment, useState } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import FileList from '@Components/FileList'
import InputTags from '@Components/InputTags/InputTags'
import MediaUpload from '@Components/MediaUpload'
import PDFViewer from '@Components/PDFViewer'
import { UploadOutlined } from '@ant-design/icons'
import { getPDFReadingTime } from '../../utils'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadPDFForm: React.FC = () => {
  const [form] = Form.useForm()
  const {
    onFormChange,
    item,
    itemId,
    courseId,
    sectionId,
    handleTopicsChange,
    topics
  } = useUploadItemForm(form)
  const [loading, setLoading] = useState(false)
  const {
    data: file,
    isFetching: loadingFile
  } = User.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  const loadingPdf = loading || loadingFile
  return (
    <Fragment>
      <Form
        onValuesChange={onFormChange}
        form={form}
        layout="vertical"
        initialValues={{ title: '', description: '' }}
      >
        <Form.Item
          name="title"
          label="Title"
          required
          tooltip="This is a required field"
        >
          <Input placeholder="Title" />
        </Form.Item>
        {/* <Form.Item name="Description" label="Description" required>
          <Input placeholder="description" />
        </Form.Item> */}
        <Form.Item>
          <Checkbox
            checked={item.isPreview}
            onChange={e => {
              const isPreview = e.target.checked
              onFormChange({ isPreview })
            }}
          >
            Avail this as a free lecture
          </Checkbox>
        </Form.Item>
        {/* <Form.Item
          name="topics"
          label={
            <span>
              Topics{' '}
            </span>
          }
          rules={[{ required: true, message: 'Please input your topics!' }]}
        >
          <InputTags
            options={topics.map(i => i.title)}
            name="topics"
            onChange={handleTopicsChange}
            ctaText="Enter Topics"
          />{' '}
        </Form.Item> */}
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Spin spinning={loadingPdf}>
              <Card
                style={{ height: 500, overflow: 'scroll' }}
                title={'PDF File'}
                extra={
                  <MediaUpload
                    isProtected
                    source={{
                      type: 'course.section.item.file',
                      value: courseId + ''
                    }}
                    width="300px"
                    onUpload={({ _id }, file) => {
                      getPDFReadingTime(file).then(time => {
                        onFormChange({
                          file: _id,
                          type: 'pdf',
                          metadata: {
                            duration: time
                          }
                        })
                      })
                    }}
                    height="250px"
                    uploadType="pdf"
                    renderItem={() => (
                      <Button icon={<UploadOutlined />}>
                        {file?.url ? 'Replace PDF' : 'Upload PDF'}
                      </Button>
                    )}
                  />
                }
              >
                {file?._id ? (
                  <PDFViewer
                    onLoadingStarted={() => setLoading(true)}
                    onLoadingEnded={() => setLoading(false)}
                    file={file}
                  />
                ) : (
                  <Empty description="No PDF Uploaded" />
                )}
              </Card>
            </Spin>
          </Col>
          <Col span={24}>
            <Card
              title="Extra Resources"
              extra={
                <ActionModal
                  cta={<Button icon={<UploadOutlined />}> Upload Files</Button>}
                >
                  <MediaUpload
                    source={{
                      type: 'course.section.item.files',
                      value: courseId + ''
                    }}
                    uploadType="file"
                    prefixKey={`courses/${courseId}/${sectionId}/${
                      itemId
                    }/files/${uniqueId()}`}
                    onUpload={({ name, _id }) => {
                      onFormChange({
                        files: [...item.files, { name, file: _id }]
                      })
                    }}
                  />
                </ActionModal>
              }
            >
              <FileList
                onDeleteFile={(fileId: string) => {
                  const files = item.files.filter((f: any) => f.file !== fileId)
                  onFormChange({ files })
                }}
                files={item.files}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </Fragment>
  )
}

export default UploadPDFForm
