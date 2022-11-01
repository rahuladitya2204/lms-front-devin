import { Form, Input } from 'antd';

import PDFViewer from '../../../../../../components/PDFViewer';
import QuillEditor from '../../../../../../components/QuillEditor';
import useUploadItemForm from '../hooks/useUploadItemForm';

interface UploadFileFormI {
  title: string;
  description: string;
  url: string;
}

const UploadFileForm: React.FC = () => {
  const { onFormChange, form, data } = useUploadItemForm<UploadFileFormI>({ title: '', description: '',url:''});
  return (
      <>
   <Form
      form={form}
      layout="vertical"
              initialValues={{ title: '', description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input  onChange={e=>onFormChange('title',e.target.value)} placeholder="input placeholder" />
      </Form.Item>
      <Form.Item name='description' label="Description" required>
      <QuillEditor onChange={e => onFormChange('description', e)} value={data.description} />
        </Form.Item>
          </Form>
    </>
  );
};

export default UploadFileForm;