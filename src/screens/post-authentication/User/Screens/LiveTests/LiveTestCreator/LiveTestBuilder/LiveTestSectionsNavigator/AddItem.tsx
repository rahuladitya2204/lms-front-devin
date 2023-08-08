import { Constants, Types } from '@adewaskar/lms-common';
import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

interface AddItemPropsI {
    closeModal?: Function;
    item?: Types.LiveTestQuestion;
    onFinish: (item: Partial<Types.LiveTestQuestion>) => void;
}

const AddItem: React.FC<AddItemPropsI> = (props) => {
    const onSubmit = (d: Types.LiveTestQuestion) => {
      props.onFinish && props.onFinish({
        ...d,
        answers:['','','',''],
      });
      form.resetFields();
        props.closeModal&&props.closeModal();
    }
    
  const [form] = Form.useForm<Types.LiveTestQuestion>();
  
  useEffect(() => {
    if (props.item) {
      form.setFieldsValue({
        title: props.item.title
      });
    }
  }, [props.item, form]);


  return (
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
    <Form.Item required name="title" label="Question Title">
      <Input placeholder='Please enter heading for the new section' />
      </Form.Item>
      <Button onClick={form.submit} type='primary'>
        Add Question
      </Button></Form>
    
  );
};

export default AddItem;