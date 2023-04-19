import { Button, Checkbox, Form, Input, Space } from 'antd'

import ActionModal from '@Components/ActionModal'
import { Common } from '@adewaskar/lms-common'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import HtmlEditor from '@Components/HtmlEditor'
import MediaPlayer from '@Components/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import { getMetadata } from 'video-metadata-thumbnails'
import { uniqueId } from 'lodash'
import { useParams } from 'react-router'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadVideoForm: React.FC = () => {
  const [form] = Form.useForm()
  const { id: courseId, sectionId, itemId } = useParams()
  const { onFormChange, item } = useUploadItemForm(form)
  const { data: file } = Common.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })

  return (
    <Fragment>
      <Form onValuesChange={onFormChange} form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          required
          tooltip="This is a required field"
        >
          <Input placeholder="Enter Video Title" />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <HtmlEditor name="description" />
        </Form.Item>
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
            <FileList files={item.files} />
            <ActionModal
              cta={
                <Button
                  type="primary"
                  shape="round"
                  icon={<PlusOutlined />}
                  size={'large'}
                />
              }
            >
              <MediaUpload
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
          </Space>
        </Form.Item>{' '}
        <Form.Item name="context" label="Preview" required>
          <MediaUpload
            prefixKey={`courses/${courseId}/${sectionId}/${itemId}/lecture`}
            fileName={item.title}
            isProtected
            width="300px"
            onUpload={({ _id }, file) => {
              getMetadata(file).then(r => {
                onFormChange({
                  file: _id,
                  metadata: {
                    duration: r.duration
                  }
                })
              })
            }}
            height="250px"
            renderItem={() => (
              <Button>{file.url ? 'Replace Video' : 'Upload Video'}</Button>
            )}
          />
          {file.url ? <MediaPlayer url={file.url} /> : null}
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default UploadVideoForm
