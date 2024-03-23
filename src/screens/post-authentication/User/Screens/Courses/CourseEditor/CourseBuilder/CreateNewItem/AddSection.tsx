import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

import TextArea from '@Components/Textarea';
import { Types } from '@invinciblezealorg/lms-common';

interface AddSectionPropsI{
  closeModal?: Function;
  data?: Types.TestSection;
  onFinish: (data: Types.TestSection) => void;
}

const AddSection: React.FC<AddSectionPropsI> = (props) => {    
  const [form] = Form.useForm<Types.TestSection>();
  const { closeModal } = props;
    const onSubmit = (data:Types.TestSection) => {
      props.onFinish&&props.onFinish(data);
      form.resetFields();
      closeModal && closeModal();
    }
    
  
  useEffect(() => {
    if (props.data) {
      form.setFieldsValue(props.data);
    }
  }, [props.data, form]);


  return (
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
    <Form.Item required name="title" label="Section Title">
      <Input placeholder='Please enter heading for the new section' />
      </Form.Item>

      <Form.Item required name="commonDetail" label="Section Title">
    <TextArea height={200} html={{level:3}} />
      </Form.Item>
      <Button htmlType='submit' type='primary'>
        Add Section
      </Button>
    </Form>
  );
};

export default AddSection;