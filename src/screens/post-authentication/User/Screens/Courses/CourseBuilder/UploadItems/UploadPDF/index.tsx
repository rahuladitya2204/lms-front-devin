import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { Fragment, useState } from 'react';

const UploadVideoa= (props:any) => {
  const onSubmit = ({title}: { title: string }) => {
    props.onFinish({
      title: title
    });
    form.resetFields(['title']);
    props.closeModal && props.closeModal();
  }
  
  const [form] = Form.useForm<{ title: string }>();

  return (
    <Fragment>
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
     <Form.Item required name="title" label="PDF Title">
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