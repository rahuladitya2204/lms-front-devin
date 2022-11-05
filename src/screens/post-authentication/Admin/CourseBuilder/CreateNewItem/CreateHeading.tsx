import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { useState } from 'react';

import { CourseNodeValueType } from '../../../../../types/Common.types';

interface CreateHeadingProps {
    children?: React.ReactNode;
    onFinish:(data:CourseNodeValueType)=>void
}

const CreateHeading: React.FC<CreateHeadingProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    
    const onSubmit = ({headingName}: { headingName: string }) => {
      props.onFinish({
        title: headingName,
        data: {
          headingName
        }
      });
      form.resetFields(['headingName']);
        closeModal();
    }
    
    const [form] = Form.useForm<{ headingName: string }>();

  return (
    <>
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['headingName'])}>
            Clear
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
          ]} title="New Heading" open={isModalOpen} onCancel={closeModal}>
              
              <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item name="headingName" label="Heading Name">
          <Input />
        </Form.Item></Form>
      
      </Modal>
    </>
  );
};

export default CreateHeading;