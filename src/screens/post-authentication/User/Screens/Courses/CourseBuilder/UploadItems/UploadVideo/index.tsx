import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useState } from 'react';
import MediaPlayer from '@Components/MediaPlayer';
import MediaUpload from '@Components/MediaUpload';
import { CreateItemPropsI } from '@Types/Common.types';


const UploadVideo: React.FC<CreateItemPropsI> = (props) => {
  const [url,setUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setUrl('')
    setIsModalOpen(false);
  };
    
    const onSubmit = ({title}: { title: string }) => {
      props.onFinish({
        title: title,
        metadata: {
          url: url
        }
      });
      form.resetFields(['title']);
        closeModal();
    }
    
    const [form] = Form.useForm<{ title: string }>();

  return (
    <Fragment>
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['title'])}>
            Clear
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
          ]} title="New Section" open={isModalOpen} onCancel={closeModal}>
              
              <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item required name="title" label="Video Title">
          <Input placeholder='Please enter title of the video' />
          </Form.Item>
          <Form.Item required name="title" label="Upload Video">
            <MediaUpload
                        renderItem={() => <MediaPlayer url={url} />}
              url={url} onUpload={e => setUrl(e[0].url)}>

          </MediaUpload>
          </Form.Item>
        </Form>
      
      </Modal>
    </Fragment>
  );
};

export default UploadVideo;