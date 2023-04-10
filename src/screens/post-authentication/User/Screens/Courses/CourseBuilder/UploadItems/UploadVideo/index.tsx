import { Button, Col, Form, Input, Modal, Row } from 'antd';
import React, { Fragment, useState } from 'react';

import MediaPlayer from '@Components/MediaPlayer';
import MediaUpload from '@Components/MediaUpload';
import { Types } from '@adewaskar/lms-common'
import { getMetadata } from 'video-metadata-thumbnails';

const UploadVideo: React.FC<Types.CreateItemPropsI> = (props) => {
  const [metadata, setMetadata] = useState({
    duration: {
      value: 0,
      unit:'seconds'
    },
    key: '',
    url:''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    
    const onSubmit = ({title}: { title: string }) => {
      // props.onFinish({
      //   title: title,
      //   metadata: metadata
      // });
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
        </Form>
      
      </Modal>
    </Fragment>
  );
};

export default UploadVideo;