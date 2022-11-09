import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useState } from 'react';
import { CreateItemPropsI } from '../../../../../../../types/Common.types';

const CreateTextItem: React.FC<CreateItemPropsI> = (props) => {
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
      });
      form.resetFields(['textHeading'])
        closeModal();
    }
    
    const [form] = Form.useForm<{ textHeading: string }>();

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default CreateTextItem;