import { Avatar, Checkbox, Form, Input, Space } from 'antd'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import QuillEditor from '@Components/QuillEditor'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import useUploadItemForm from '../hooks/useUploadItemForm'

const AddTextItem: React.FC = () => {
  const [form] = Form.useForm()
  const { onFormChange, item } = useUploadItemForm(form)

  return (
    <Fragment>
      <Form form={form} layout="vertical" onValuesChange={onFormChange}>
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Enter Text Content's title" />
        </Form.Item>
        <Form.Item label="Preview" tooltip="This is a preview item">
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
        <Form.Item name="description" label="Description" required>
          <SunEditorComponent name="description" />
        </Form.Item>
        <Form.Item label="Add Files" required>
          <Space direction="horizontal">
            <FileList
              files={item.files}
              onDeleteFile={fileId => {
                const files = item.files.filter(f => f.file !== fileId)
                onFormChange({ files })
              }}
            />
            <ActionModal
              cta={
                <Avatar
                  style={{ background: 'transparent' }}
                  shape="square"
                  size={80}
                  icon={<PlusOutlined />}
                />
              }
            >
              <MediaUpload
                uploadType="file"
                isProtected
                onUpload={({ name, _id, isProtected }) => {
                  onFormChange({
                    files: [...item.files, { name, file: _id }]
                  })
                }}
              />
            </ActionModal>
          </Space>
        </Form.Item>{' '}
      </Form>
    </Fragment>
  )
}

export default AddTextItem
