import { Form, Input } from 'antd'
import { Fragment } from 'react'
import QuillEditor from '../../../../../../../../components/QuillEditor';
import useUploadItemForm from '../hooks/useUploadItemForm'

interface AddTextItemForm {
  title: string;
  description: string;
}

const AddTextItem: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm<AddTextItemForm>( { title: '', description: ''});
  return (
    <Fragment>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onFormChange}
      >
        <Form.Item
          name="title"
          label="Title"
          required
          tooltip="This is a required field"
        >
          <Input
            placeholder="Enter Text Content's title"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          required
          tooltip="This is a required field"
        >
          <QuillEditor
            onChange={e => onFormChange({'description': e})}
            value={item.description}
          />
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default AddTextItem
