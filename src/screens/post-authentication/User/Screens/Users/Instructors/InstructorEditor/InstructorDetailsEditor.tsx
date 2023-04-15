import { Form, Input, } from 'antd';
import React, { Fragment, useEffect } from 'react';

import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload';
import QuillEditor from '@Components/QuillEditor';
import { Types } from '@adewaskar/lms-common'

interface CreateInstructorComponentPropsI {

}

const InstructorDetailsEditor: React.FC<CreateInstructorComponentPropsI> = (props) => {
  const [form] = Form.useForm<Types.Instructor>();

  
  const image = form.getFieldValue('image');


  return (
    <Fragment>
      {/* <Form.Item name="image" required label="Profile Image">
          <MediaUpload
            uploadType={'image'}
            prefixKey={`images/instructors/${props.formData._id}`}
            cropper
            width='100px'
            renderItem={() => <Image src={image} />}
            onUpload={e => {
            props.onFormUpdate({
              image:e.url
            })

  }} />

</Form.Item> */}
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
        <QuillEditor name="aboutMe" />
        </Form.Item>
    </Fragment>
  );
};

export default InstructorDetailsEditor;