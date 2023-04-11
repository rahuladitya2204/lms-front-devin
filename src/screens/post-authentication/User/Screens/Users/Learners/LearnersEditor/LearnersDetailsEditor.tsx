import { Form, Input, } from 'antd';
import React, { Fragment, useEffect } from 'react';

import FileUpload from '@Components/FileUpload';
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload';
import { Types } from '@adewaskar/lms-common'

interface CreateLearnerComponentPropsI {
  formData: Partial<Types.Learner>;
  onFormUpdate: (d:Partial<Types.Learner>)=>void;}

const LearnerDetailsEditor: React.FC<CreateLearnerComponentPropsI> = (props) => {
  const learner = props.formData;
  const [form] = Form.useForm<Types.Learner>();
  useEffect(() => {
    form.setFieldsValue(props.formData);
  }, [props.formData]);
  
  const image = form.getFieldValue('image');


  return (
    <Fragment>
      <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">
        <Form.Item name="name" label="Name" required>
        <Input placeholder="Name of the student" />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
        <Input placeholder="Please enter email of the learner" />
        </Form.Item>

        <Form.Item name="contactNo" label="Mobile" required>
        <Input placeholder="Please enter contact number of the learner" />
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default LearnerDetailsEditor;