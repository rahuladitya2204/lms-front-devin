import { Form, Input } from 'antd';
import { Fragment } from 'react';
import MediaPlayer from '@Components/MediaPlayer';
import QuillEditor from '@Components/QuillEditor';

import useUploadItemForm from '../hooks/useUploadItemForm';

interface UploadVideoForm {
  title: string;
  context: string;
  description: string;
  url: string;
}


const UploadVideoForm: React.FC = (props) => {
  const { onFormChange, form, item } = useUploadItemForm<UploadVideoForm>( { title: '', description: '',url:'',context:''});
  const VideoUrl = item?.metadata?.url;
  return (
      <Fragment>
   <Form onValuesChange={onFormChange}
      form={form}
      layout="vertical"
              initialValues={{ title: '', description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input placeholder="Enter Video Title" />
      </Form.Item>
      <Form.Item name='description' label="Description" required>
      <QuillEditor onChange={e => onFormChange({'description':e})} value={item.description} />
        </Form.Item>

        <Form.Item name='context' label="Preview" required>
          {VideoUrl?<MediaPlayer url={VideoUrl} />:null}
        </Form.Item>

          </Form>
    </Fragment>
  );
};

export default UploadVideoForm;