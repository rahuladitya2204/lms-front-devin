import { Button, Card, Checkbox, Form, Input, Space } from 'antd'

import { Common } from '@adewaskar/lms-common'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import MediaUpload from '@Components/MediaUpload'
import PDFViewer from '@Components/PDFViewer'
import { getPDFReadingTime } from '../../utils'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadPDFForm: React.FC = () => {
  const [form] = Form.useForm()
  const { onFormChange, item, itemId, courseId, sectionId } = useUploadItemForm(
    form
  )
  const { data: file } = Common.Queries.useGetFileDetails(item.file + '', {
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
        <Form.Item label="Add Files" required>
          <Space direction="horizontal">
            <FileList
              onDeleteFile={fileId => {
                const files = item.files.filter(f => f.file !== fileId)
                onFormChange({ files })
              }}
              files={item.files}
              uploadFileInput={
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
              }
            />
          </Space>
        </Form.Item>
        <Form.Item name="PDF File" label="PDF File" required>
          <MediaUpload
            isProtected
            source={{
              type: 'course.section.item.file',
              value: courseId + ''
            }}
            width="300px"
            onUpload={({ _id }, file) => {
              console.log(file, 'aaa')
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
              <Button>{file?.url ? 'Replace PDF' : 'Upload PDF'}</Button>
            )}
          />
        </Form.Item>
      </Form>
      <Card title={file.name}>
        {file?.url ? <PDFViewer file={file} /> : null}
      </Card>
    </Fragment>
  )
}

export default UploadPDFForm
