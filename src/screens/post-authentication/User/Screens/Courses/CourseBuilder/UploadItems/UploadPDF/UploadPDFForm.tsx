import { Form, Input } from 'antd'
import { Fragment } from 'react'

import useUploadItemForm from '../hooks/useUploadItemForm'

interface UploadPDFFormI {
  title: string;
  description: string;
  url: string;
}

const UploadPDFForm: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm<UploadPDFFormI>({ title: '', description: '',url:''});
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
          <Input
            placeholder="input placeholder"
          />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <Input
            placeholder="input placeholder"
          />
        </Form.Item>
      </Form>
      {/* <PDFViewer url={data.url} /> */}
    </Fragment>
  )
}

export default UploadPDFForm
