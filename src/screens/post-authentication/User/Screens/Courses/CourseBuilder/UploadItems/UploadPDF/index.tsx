import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import DraggerUpload from '../../../../../../../../components/DraggerUpload';
import { CreateItemPropsI, UploadFileType } from '@Types/Common.types';

const UploadVideoa: React.FC<CreateItemPropsI> = (props) => {
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
      url:file.url
    });
    closeModal();
    }
    
    const [form] = Form.useForm<{ url: string }>();

  return (
    <Fragment>
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>closeModal()}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onSubmit}>
            Submit
          </Button>,
          ]} title="New PDF: Max Size 250MB" open={isModalOpen} onCancel={closeModal}>
               <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: `Upload PDF`,
        key: '1',
        children: <DraggerUpload onUpload={u => {
          setFiles(u);
        }}/>,
      },
      {
        label: `Public URL`,
        key: '2',
        children:  <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item name="url" label="Public URL:*">
          <Input />
          </Form.Item>
        </Form>,
      }
    ]}
  />
      
      </Modal>
    </Fragment>
  );
};

export default UploadVideoa;