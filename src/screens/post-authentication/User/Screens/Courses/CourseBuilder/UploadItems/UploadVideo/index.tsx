import { Button, Form, Input } from 'antd';
import React, { Fragment } from 'react';

import { Types } from '@adewaskar/lms-common'

const UploadVideo: React.FC<Types.CreateItemPropsI> = (props) => {
    const onSubmit = ({title}: { title: string }) => {
      props.onFinish({
        title: title
      });
      form.resetFields(['title']);
      props.closeModal&&props.closeModal();
    }
    
    const [form] = Form.useForm<{ title: string }>();

  return (
    <Fragment>
       <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item required name="title" label="Video Title">
          <Input placeholder='Please enter title of the video' />
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