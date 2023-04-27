import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useState } from 'react';

import { Types } from '@adewaskar/lms-common'

const CreateTextItem: React.FC<Types.CreateItemPropsI> = (props:any) => {
    const onSubmit = ({textHeading}: { textHeading: string }) => {
      props.onFinish({
        title: textHeading,
      });
      form.resetFields(['textHeading']);
      props.closeModal && props.closeModal();
    }
    
    const [form] = Form.useForm<{ textHeading: string }>();

  return (
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
    <Form.Item  rules={[{ required: true, message: 'Please mention title for Text Page' }]} name="textHeading" label="Text Heading">
      <Input />
      </Form.Item>
      <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>
    </Form>
  );
};

export default CreateTextItem;