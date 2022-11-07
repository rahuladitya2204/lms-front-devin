import { Form, Input } from 'antd';
import { Fragment } from 'react';

import MediaPlayer from '../../../../../../../components/MediaPlayer';
import QuillEditor from '../../../../../../../components/QuillEditor';
import useUploadItemForm from '../hooks/useUploadItemForm';

interface UploadVideoForm {
  title: string;
  context: string;
  description: string;
  url: string;
}


const UploadVideoForm: React.FC = (props) => {
  const { onFormChange, form, data } = useUploadItemForm<UploadVideoForm>( { title: '', description: '',url:'',context:''});
  const VideoUrl = data.url;
  return (
      <Fragment>
   <Form
      form={form}
      layout="vertical"
              initialValues={{ title: '', description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input  onChange={e=>onFormChange('title',e.target.value)} placeholder="Enter Video Title" />
      </Form.Item>
      <Form.Item name='description' label="Description" required>
      <QuillEditor onChange={e => onFormChange('description', e)} value={data.description} />
        </Form.Item>
        <Form.Item name='context' label="Context" required>
      <QuillEditor onChange={e => onFormChange('context', e)} value={data.context} />
        </Form.Item>
        
        <Form.Item name='context' label="Preview" required>
          {VideoUrl?<MediaPlayer url={VideoUrl} />:null}
        </Form.Item>

          </Form>
    </Fragment>
  );
};

export default UploadVideoForm;