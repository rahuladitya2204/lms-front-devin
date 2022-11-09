import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useState } from 'react';
import { CreateItemPropsI } from '../../../../../../../types/Common.types';



const CreateHeading: React.FC<CreateItemPropsI> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    
    const onSubmit = ({headingName}: { headingName: string }) => {
      props.onFinish({
        title:headingName
      });
      form.resetFields(['headingName']);
        closeModal();
    }
    
    const [form] = Form.useForm<{ headingName: string }>();

  return (
    <Fragment>
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['headingName'])}>
            Clear
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
          ]} title="New Section" open={isModalOpen} onCancel={closeModal}>
              
              <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item required name="headingName" label="Section Heading">
          <Input placeholder='Please enter heading for the new section' />
        </Form.Item></Form>
      
      </Modal>
    </Fragment>
  );
};

export default CreateHeading;