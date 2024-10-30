import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

import { Types } from '@adewaskar/lms-common';

export interface AddItemProps { item?: Partial<Types.CourseSectionItem>, onFinish?: Function, closeModal?: Function }

const UploadVideoa = (props: AddItemProps) => {
  const onSubmit = ({ title }: { title: string }) => {
    props.onFinish && props.onFinish({
      item: {
        title: title
      }
    });
    form.resetFields(['title']);
    props.closeModal && props.closeModal();
  }

  const [form] = Form.useForm<{ title: string }>();

  useEffect(() => {
    if (props.item) {
      form.setFieldsValue({
        title: props.item.title
      });
    }
  }, [props.item, form]);


  return (
    <Fragment>
      <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item rules={[{ required: true, message: 'Please mention title for PDF' }]} required name="title" label="PDF Title">
          <Input placeholder='Please enter title of the PDF' />
        </Form.Item>
        <Button key="submit" type="primary" onClick={form.submit}>
          Submit
        </Button>
      </Form>
    </Fragment>
  );
};

export default UploadVideoa;