import { Form, Image, Input, } from 'antd';
import React, { Fragment, useEffect } from 'react';

import FileUpload from '../../../../../../../components/FileUpload';
import { Learner } from '../../../../../../../types/Learner.types';

interface CreateLearnerComponentPropsI {
  formData: Partial<Learner>;
  onFormUpdate: (d:Partial<Learner>)=>void;}

const LearnerDetailsEditor: React.FC<CreateLearnerComponentPropsI> = (props) => {
  const [form] = Form.useForm<Learner>();
  useEffect(() => {
    form.setFieldsValue(props.formData);
  }, [props.formData]);
  
  const image = form.getFieldValue('image') || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";


  return (
    <Fragment>
      <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">
      <Form.Item name="image" required label="Profile Image">
  <FileUpload onUpload={e => {
    form.setFieldValue('image', e[0].url);
  }}>
  <Image preview={false}
      width={200}
      fallback={"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}
src={image}
/>
</FileUpload>
</Form.Item>
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