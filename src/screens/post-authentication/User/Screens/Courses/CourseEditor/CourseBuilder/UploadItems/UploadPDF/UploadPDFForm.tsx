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
  Upload
} from 'antd'
import { Common, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import MediaUpload from '@Components/MediaUpload'
import PDFViewer from '@Components/PDFViewer'
import { UploadOutlined } from '@ant-design/icons'
import { getPDFReadingTime } from '../../utils'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadPDFForm: React.FC = () => {
  const [form] = Form.useForm()
  const { onFormChange, item, itemId, courseId, sectionId } = useUploadItemForm(
    form
  )
  const { data: file } = User.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
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
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card
              style={{ height: 500 }}
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
                <PDFViewer file={file} />
              ) : (
                <Empty description="No PDF Uploaded" />
              )}
            </Card>
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
                userType="user"
                onDeleteFile={(fileId: string) => {
                  const files = item.files.filter(f => f.file !== fileId)
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
