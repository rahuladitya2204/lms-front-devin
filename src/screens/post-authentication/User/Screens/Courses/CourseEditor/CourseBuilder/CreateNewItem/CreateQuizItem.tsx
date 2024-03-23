import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

import { AddItemProps } from '../UploadItems/UploadPDF';
import { Types } from '@invinciblezealorg/lms-common'

const CreateQuizItem: React.FC<Types.CreateItemPropsI> = (props:AddItemProps) => {
    const onSubmit = ({textHeading}: { textHeading: string }) => {
      props.onFinish&& props.onFinish({
        title: textHeading,
      });
      form.resetFields(['textHeading']);
      props.closeModal && props.closeModal();
    }
    
  const [form] = Form.useForm<{ textHeading: string }>();
  
  useEffect(() => {
    if (props.item) {
      form.setFieldsValue({
        textHeading: props.item.title
      });
    }
  }, [props.item, form]);

  return (
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
    <Form.Item  rules={[{ required: true, message: 'Please mention title for Quiz' }]} name="textHeading" label="Quiz Title">
      <Input />
      </Form.Item>
      <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>
    </Form>
  );
};

export default CreateQuizItem;