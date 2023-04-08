import { Avatar, Button, Checkbox, Form, Input, Space } from 'antd'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import { Learner } from '@adewaskar/lms-common'
import MediaPlayer from '@Components/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import QuillEditor from '@Components/QuillEditor'
import UploadFiles from '@Components/UploadFiles'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadVideoForm: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm()
  const VideoKey = item?.metadata?.key + ''
  const { data: VideoUrl } = Learner.Queries.useGetPresignedUrl(VideoKey)

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
          <Input placeholder="Enter Video Title" />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <QuillEditor />
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
              cta={<Avatar shape="square" size={80} icon={<PlusOutlined />} />}
            >
              <UploadFiles
                onUpload={({ name, url }) => {
                  onFormChange({
                    files: [...item.files, { name, url }]
                  })
                }}
              />
            </ActionModal>
          </Space>
        </Form.Item>{' '}
        <Form.Item name="context" label="Preview" required>
          <MediaUpload
            isProtected
            width="300px"
            onUpload={({ url, key, metadata }) => {
              onFormChange({
                metadata: {
                  url: url,
                  key: key,
                  ...metadata
                }
              })
              // setUrl(url)
            }}
            height="250px"
            renderItem={() => (
              <Button>{VideoUrl ? 'Replace Video' : 'Upload Video'}</Button>
            )}
          />
          {VideoUrl ? <MediaPlayer url={VideoUrl} /> : null}
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default UploadVideoForm
