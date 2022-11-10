import { Form, Image, Input, } from 'antd';
import React, { Fragment, useEffect } from 'react';

import FileUpload from '@Components/FileUpload';
import { Instructor } from '@Types/Instructor.types';
import QuillEditor from '@Components/QuillEditor';

interface CreateInstructorComponentPropsI {
  formData: Partial<Instructor>;
  onFormUpdate: (d:Partial<Instructor>)=>void;}

const InstructorDetailsEditor: React.FC<CreateInstructorComponentPropsI> = (props) => {
  const [form] = Form.useForm<Instructor>();
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
        <Input placeholder="Name of the instructor" />
          </Form.Item>
          <Form.Item name="designation" label="Designation" required>
        <Input placeholder="Designation of the instructor" />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
        <Input placeholder="Please enter email of the instructor" />
        </Form.Item>
        <Form.Item name="aboutMe" label="About Me" required>
        <QuillEditor onChange={e => props.onFormUpdate({aboutMe:e})} />
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default InstructorDetailsEditor;