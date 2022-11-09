import { Form, Input } from 'antd';
import { Fragment } from 'react';
import QuillEditor from '../../../../../../../components/QuillEditor';
import useUploadItemForm from '../hooks/useUploadItemForm';

interface UploadFileFormI {
  title: string;
  description: string;
  url: string;
}

const UploadFileForm: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm<UploadFileFormI>({ title: '', description: '',url:''});
  return (
      <Fragment>
   <Form onValuesChange={onFormChange}
      form={form}
      layout="vertical"
              initialValues={{ title: '', description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input  placeholder="input placeholder" />
      </Form.Item>
      <Form.Item name='description' label="Description" required>
      <QuillEditor onChange={e => onFormChange({'description': e})} value={item.description} />
        </Form.Item>
          </Form>
    </Fragment>
  );
};

export default UploadFileForm;