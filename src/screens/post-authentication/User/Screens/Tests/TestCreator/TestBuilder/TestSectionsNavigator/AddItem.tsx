import { Button, Form, Input, Modal } from 'antd';
import { Constants, Types } from '@adewaskar/lms-common';
import React, { Fragment, useEffect, useState } from 'react';

interface AddItemPropsI {
    closeModal?: Function;
    item?: Types.TestQuestion;
    onFinish: (item: Partial<Types.TestQuestion>) => void;
}

const AddItem: React.FC<AddItemPropsI> = (props) => {
    const onSubmit = (d: Types.TestQuestion) => {
      props.onFinish && props.onFinish({
        ...d,
        options:[Constants.INITIAL_TEST_QUESTION_OPTION,Constants.INITIAL_TEST_QUESTION_OPTION,Constants.INITIAL_TEST_QUESTION_OPTION,Constants.INITIAL_TEST_QUESTION_OPTION],
      });
      form.resetFields();
        props.closeModal&&props.closeModal();
    }
    
  const [form] = Form.useForm<Types.TestQuestion>();
  
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