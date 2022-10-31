import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { useState } from 'react';

import UploadComponent from '../../../../components/Upload';
import { useCreateCourse } from '../../../../queries/Courses/CoursesHooks';

interface UploadPDFProps {
    children?: React.ReactNode;
    onFinish:(url:string)=>void
}

const UploadPDF: React.FC<UploadPDFProps> = (props) => {
    const {mutate:createCourse,isLoading: loading }=useCreateCourse()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    const onSubmit = (e:{url:string}) => {
        closeModal();
    }
    
    const [form] = Form.useForm<{ url: string }>();

  return (
    <>
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['instructorName','title'])}>
            Clear
          </Button>,
          <Button loading={loading} key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
          ]} title="New PDF: Max Size 250MB" open={isModalOpen} onCancel={closeModal}>
               <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: `Upload PDF`,
        key: '1',
        children: <UploadComponent onUpload={u => {
          console.log(u,'123123')
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

export default UploadPDF;