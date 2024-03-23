import { Button, Form, Input } from 'antd';
import React, { Fragment, useEffect } from 'react';

import { AddItemProps } from '../UploadPDF';
import { Types } from '@invinciblezealorg/lms-common'

const UploadVideo = (props:AddItemProps) => {
    const onSubmit = ({title}: { title: string }) => {
      props.onFinish&&props.onFinish({
        title: title
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
        <Form.Item  rules={[{ required: true, message: 'Please mention title for Video' }]} required name="title" label="Video Title">
          <Input  placeholder='Please enter title of the video' />
        </Form.Item>
        {/* <Button key="back" onClick={()=>form.resetFields(['title'])}>
            Clear
          </Button>, */}
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>
        </Form>
    </Fragment>
  );
};

export default UploadVideo;