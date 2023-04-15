import { Avatar, Checkbox, Form, Input, Space } from 'antd'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import QuillEditor from '@Components/QuillEditor'
import useUploadItemForm from '../hooks/useUploadItemForm'

const AddTextItem: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm()

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
          <QuillEditor name="decription"
            onChange={e => onFormChange({ description: e })}
            value={item?.description}
          />
        </Form.Item>
        <Form.Item label="Add Files" required>
          <Space direction="horizontal">
            <FileList files={item.files} />
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
                onUpload={({ name, key, isProtected }) => {
                  onFormChange({
                    files: [...item.files, { name, key, isProtected }]
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
