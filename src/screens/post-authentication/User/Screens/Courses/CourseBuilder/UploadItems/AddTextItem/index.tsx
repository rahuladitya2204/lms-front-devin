import { Checkbox, Form, Input } from 'antd'

import { Fragment } from 'react'
import QuillEditor from '@Components/QuillEditor'
import UploadFiles from '@Components/UploadFiles';
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
            value={item.description}
          />
        </Form.Item>

        <Form.Item label="Add Files" required>
          <UploadFiles />
        </Form.Item>      </Form>
    </Fragment>
  )
}

export default AddTextItem
