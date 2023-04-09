import { Avatar, Button, Checkbox, Form, Input, Space } from 'antd'
import { Common, Learner } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import MediaPlayer from '@Components/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import QuillEditor from '@Components/QuillEditor'
import UploadFiles from '@Components/UploadFiles'
import { useParams } from 'react-router'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadVideoForm: React.FC = () => {
  const { id: courseId, sectionId, itemId } = useParams()
  const { onFormChange, form, item } = useUploadItemForm()
  console.log(item.file, 'item')
  const { data: file } = Common.Queries.useGetFileDetails(item.file + '')

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
            keyName={`courses/${courseId}/${sectionId}/${itemId}`}
            isProtected
            width="300px"
            onUpload={({ url, key, _id }) => {
              onFormChange({
                file: _id
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
