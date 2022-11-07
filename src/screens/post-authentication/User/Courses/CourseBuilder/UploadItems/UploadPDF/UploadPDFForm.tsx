import { Form, Input } from 'antd'
import { Fragment } from 'react'

import PDFViewer from '../../../../../../../components/PDFViewer'
import useUploadItemForm from '../hooks/useUploadItemForm'

interface UploadPDFFormI {
  title: string;
  description: string;
  url: string;
}

const UploadPDFForm: React.FC = () => {
  const { onFormChange, form, data } = useUploadItemForm<UploadPDFFormI>({ title: '', description: '',url:''});
  return (
    <Fragment>
      <Form
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
            onChange={e => onFormChange('title', e.target.value)}
            placeholder="input placeholder"
          />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <Input
            onChange={e => onFormChange('description', e.target.value)}
            placeholder="input placeholder"
          />
        </Form.Item>
      </Form>
      <PDFViewer url={data.url} />
    </Fragment>
  )
}

export default UploadPDFForm
