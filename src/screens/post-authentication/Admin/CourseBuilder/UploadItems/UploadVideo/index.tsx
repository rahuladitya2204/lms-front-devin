import { Button, Form, Input, Modal, Tabs } from 'antd';
import { CourseNodeValueType, UploadFileType } from '../../../../../../types/Common.types';
import React, { useState } from 'react';

import UploadComponent from '../../../../../../components/FileUpload';

interface UploadVideoProps {
    children?: React.ReactNode;
    onFinish:(data:CourseNodeValueType)=>void
}

const UploadVideo: React.FC<UploadVideoProps> = (props) => {
  const [files, setFiles] = useState<UploadFileType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const onSubmit = () => {
    const file = files[0];
    props.onFinish({
      title: file.name,
      data: {
        url:file.url
      }
    });
    closeModal();
    }
    
    const [form] = Form.useForm<{ url: string }>();

  return (
    <>
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>closeModal()}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onSubmit}>
            Submit
          </Button>,
          ]} title="New Video" open={isModalOpen} onCancel={closeModal}>
               <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: `Upload Video`,
        key: '1',
        children: <UploadComponent onUpload={u => {
          setFiles(u);
        }}/>,
      },
      {
        label: `Public URL`,
        key: '2',
        children:  <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item name="url" label="Public URL:*">
          <Input />
        </Form.Item></Form>,
      }
    ]}
  />
      
      </Modal>
    </>
  );
};

export default UploadVideo;