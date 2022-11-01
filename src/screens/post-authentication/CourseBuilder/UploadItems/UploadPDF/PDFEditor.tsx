import { Button, Form, Input } from 'antd';
import { useOutletContext, useSearchParams } from 'react-router-dom';

import { CourseTreeTypeNode } from '../../../../../types/Common.types';
import PDFViewer from '../../../../../components/PDFViewer';
import React from 'react';
import { findNode } from '../../utils';

const PDFEditor: React.FC = (props) => {
  
  const [searchParams] = useSearchParams();
  const url = searchParams.get("value");
  const nodeId = searchParams.get("nodeId") || '';

  const [courseData, updateCourseData] = useOutletContext<[CourseTreeTypeNode[],(nodeId:string,data:unknown)=>void]>();

  const node = findNode(nodeId, courseData);

  const data: any = node.data;
  
  const onFormChange = ( value: string,key:string ) => {
    updateCourseData(nodeId, {
      ...data,
      [key]: value
      })
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
        <Input  onChange={e=>onFormChange('title',e.target.value)} placeholder="input placeholder" />
      </Form.Item>
      <Form.Item name='description' label="Description" required>
        <Input onChange={e=>onFormChange('description',e.target.value)} placeholder="input placeholder" />
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