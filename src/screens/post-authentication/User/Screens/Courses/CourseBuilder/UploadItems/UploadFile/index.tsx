import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { Fragment, useState } from 'react';

import FileUpload from '@Components/FileUpload';
import { Types } from '@adewaskar/lms-common'
import UploadFiles from '@Components/UploadFiles';

const UploadFile: React.FC<Types.CreateItemPropsI> = (props) => {
  const [files, setFiles] = useState<Types.UploadFileType[]>([]);
  
  const onSubmit = () => {
    const file = files[0];
    props.onFinish({
      title: file.name,
      metadata: {
        url:file.url
      }
    });
    }
    
    const [form] = Form.useForm<{ url: string }>();

  return (
    <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: `Upload File`,
        key: '1',
        children: <UploadFiles onUpload={u => {
          // setFiles(u);
        }}/>,
      },
      {
        label: `Public URL`,
        key: '2',
        children:  <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
        <Form.Item name="url" label="Public URL:*">
          <Input />
          </Form.Item>
        </Form>,
      }
    ]}
  />
  );
};

export default UploadFile;