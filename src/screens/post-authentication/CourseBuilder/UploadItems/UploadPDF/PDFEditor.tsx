import { Button, Form, Input, Modal, Tabs } from 'antd';
import React, { useState } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import PDFViewer from '../../../../../components/PDFViewer';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

interface PDFEditorProps {
    children?: React.ReactNode;
}

const PDFEditor: React.FC<PDFEditorProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const url = searchParams.get("value");

    const onSubmit = ({headingName}: { headingName: string }) => {
        // props.onFinish(headingName)
    }
    
    const [form] = Form.useForm<{ headingName: string }>();

  return (
      <>
   <Form
      form={form}
      layout="vertical"
              initialValues={{ title: '', description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item name='description' label="Description" required>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
          </Form>
          <PDFViewer url={''+url} />
    </>
  );
};

export default PDFEditor;