import { Form, Input } from 'antd'

import { Fragment } from 'react'
import UploadFiles from '@Components/UploadFiles'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadFileForm: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm()
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
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <UploadFiles onUpload={() => {}} />
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default UploadFileForm
