import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { useState } from 'react';

import { CourseNodeValueType } from '../../../../types/Common.types';

interface CreateTextItemProps {
    children?: React.ReactNode;
    onFinish:(data:CourseNodeValueType)=>void
}

const CreateTextItem: React.FC<CreateTextItemProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    
    const onSubmit = ({textHeading}: { textHeading: string }) => {
      props.onFinish({
        title: textHeading,
        data: {
          title:textHeading
        }
      });
        closeModal();
    }
    
    const [form] = Form.useForm<{ textHeading: string }>();

  return (
    <>
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['textHeading'])}>
            Clear
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
          ]} title="New Heading" open={isModalOpen} onCancel={closeModal}>
              
              <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item name="textHeading" label="Heading Name">
          <Input />
        </Form.Item></Form>
      
      </Modal>
    </>
  );
};

export default CreateTextItem;