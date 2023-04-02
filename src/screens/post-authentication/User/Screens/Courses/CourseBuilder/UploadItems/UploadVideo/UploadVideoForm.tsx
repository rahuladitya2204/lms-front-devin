import { Button, Checkbox, Form, Input } from 'antd'

import { Fragment } from 'react'
import MediaPlayer from '@Components/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import QuillEditor from '@Components/QuillEditor'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadVideoForm: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm()
  const VideoUrl = item?.metadata?.url || item?.metadata?.key
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
        <Form.Item
        // label="Preview"
        // tooltip="This is a preview item"
        >
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
        <Form.Item name="context" label="Preview" required>
          <MediaUpload
            width="300px"
            onUpload={({ url }) => {
              onFormChange({
                metadata: {
                  url: url
                  // key: key
                }
              })
              // setUrl(url)
            }}
            height="250px"
            renderItem={() => (
              <Button>{VideoUrl ? 'Replace Video' : 'Upload Video'}</Button>
            )}
            url={VideoUrl}
          />
          {VideoUrl ? <MediaPlayer url={item.metadata?.url} /> : null}
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default UploadVideoForm
