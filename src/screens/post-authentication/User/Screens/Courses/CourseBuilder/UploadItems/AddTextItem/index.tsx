import { Avatar, Checkbox, Form, Input, Space } from 'antd'
import { FileOutlined, PlusOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import { Fragment } from 'react'
import QuillEditor from '@Components/QuillEditor'
import UploadFile from '../UploadFile'
import UploadFiles from '@Components/UploadFiles'
import useUploadItemForm from '../hooks/useUploadItemForm'

interface AddTextItemForm {
  title: string;
  isPreview: boolean;
  description: string;
}

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
          <QuillEditor
            onChange={e => onFormChange({ description: e })}
            value={item?.description}
          />
        </Form.Item>
        <Form.Item label="Add Files" required>
          <UploadFiles
            onUpload={e => onFormChange({ files: [...item.files, e.url] })}
          />
        </Form.Item>{' '}
        <Space direction="horizontal">
          {item?.files?.map(file => {
            return <Avatar shape="square" size={80} icon={<FileOutlined />} />
          })}
          <ActionModal
            cta={<Avatar shape="square" size={80} icon={<PlusOutlined />} />}
          >
            {/* <UploadFile /> */}
          </ActionModal>
        </Space>
      </Form>
    </Fragment>
  )
}

export default AddTextItem
