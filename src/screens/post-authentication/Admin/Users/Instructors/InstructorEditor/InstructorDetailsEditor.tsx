import { Form, Image, Input, } from 'antd';
import React, { useEffect } from 'react';

import FileUpload from '../../../../../../components/FileUpload';
import { InstructorDetailsType } from '../../../../../../types/Instructor.types';
import QuillEditor from '../../../../../../components/QuillEditor';

interface CreateInstructorComponentPropsI {
  formData: Partial<InstructorDetailsType>;
  onFormUpdate: (d:Partial<InstructorDetailsType>)=>void;}

const InstructorDetailsEditor: React.FC<CreateInstructorComponentPropsI> = (props) => {
  const [form] = Form.useForm<InstructorDetailsType>();
  useEffect(() => {
    form.setFieldsValue(props.formData);
  }, [props.formData]);
  
  const image = form.getFieldValue('image') || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";


  return (
    <>
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
    </>
  );
};

export default InstructorDetailsEditor;