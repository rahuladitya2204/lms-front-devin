import { Form, Input, } from 'antd';
import React, { Fragment, useEffect } from 'react';

import Image from '@Components/Image'
import ImageUpload from '@Components/ImageUpload';
import QuillEditor from '@Components/QuillEditor';
import { Types } from '@adewaskar/lms-common'

interface CreateInstructorComponentPropsI {
  formData: Partial<Types.Instructor>;
  onFormUpdate: (d:Partial<Types.Instructor>)=>void;}

const InstructorDetailsEditor: React.FC<CreateInstructorComponentPropsI> = (props) => {
  const [form] = Form.useForm<Types.Instructor>();
  useEffect(() => {
    form.setFieldsValue(props.formData);
  }, [props.formData]);
  
  const image = form.getFieldValue('image');


  return (
    <Fragment>
      <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">
      <Form.Item name="image" required label="Profile Image">
          <ImageUpload keyName={`images/instructors/${props.formData._id}`} cropper url={image} width='100px'
            renderItem={() => <Image src={image} />}
            onUpload={e => {
            props.onFormUpdate({
              image:e.url
            })

  }} />

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