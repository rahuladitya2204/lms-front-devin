import { Form, Input, } from 'antd';
import React, { Fragment, useEffect } from 'react';

import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload';
import TextArea from '@Components/Textarea';
import { Types } from '@adewaskar/lms-common'

interface CreateUserComponentPropsI {
  userId: string;
  saveUser: (d:Partial<Types.User>) => void;
}

const UserDetailsEditor: React.FC<CreateUserComponentPropsI> = (props) => {
  const form = Form.useFormInstance<Types.User>();  
  const image = Form.useWatch(['image'], form);
  return (
    <Fragment>
      <Form.Item name="image" required label="Profile Image">
          <MediaUpload
            uploadType={'image'}
            prefixKey={`images/users/${props.userId}`}
            cropper={{width:150,height:150}}
            width='100px'
            renderItem={() => <Image src={image+''} />}
            onUpload={file=> {
              props.saveUser({
                image: file.url
              })
  }} />

</Form.Item>
        <Form.Item name="name" label="Name" required>
        <Input placeholder="Name of the user" />
          </Form.Item>
          <Form.Item name="designation" label="Designation" required>
        <Input placeholder="Designation of the user" />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
        <Input placeholder="Please enter email of the user" />
        </Form.Item>
        <Form.Item name="aboutMe" label="About Me" required>
        <TextArea html name="aboutMe" />
        </Form.Item>
    </Fragment>
  );
};

export default UserDetailsEditor;