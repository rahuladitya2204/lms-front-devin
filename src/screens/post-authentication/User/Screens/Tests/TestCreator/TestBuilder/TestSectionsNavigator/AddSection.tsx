import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

const AddSection: React.FC<any> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    
    const onSubmit = ({sectionTitle}: { sectionTitle: string }) => {
      props.onFinish&&props.onFinish({
        title:sectionTitle
      });
      form.resetFields(['sectionTitle']);
        closeModal();
    }
    
  const [form] = Form.useForm<{ sectionTitle: string }>();
  
  useEffect(() => {
    if (props.section) {
      form.setFieldsValue({
        sectionTitle: props.section.title
      });
    }
  }, [props.section, form]);


  return (
    <Fragment>
       {/* @ts-ignore */}
      <span onClick={showModal}>{props.children}</span>
      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['sectionTitle'])}>
            Clear
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
          ]} open={isModalOpen} onCancel={closeModal}>
              
              <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item required name="sectionTitle" label="Section Title">
          <Input placeholder='Please enter heading for the new section' />
        </Form.Item></Form>
      
      </Modal>
    </Fragment>
  );
};

export default AddSection;