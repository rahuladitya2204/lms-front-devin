import { Button, Form, Input } from 'antd';
import { useOutletContext, useParams } from 'react-router-dom';

import { CourseTreeTypeNode } from '../../../../../types/Common.types';
import React from 'react';
import { findNode } from '../../utils';

interface UploadVideoForm {
  title: string;
  description: string;
}


const UploadVideoForm: React.FC = (props) => {
  let { nodeId } = useParams();
  if (!nodeId)
  {
    nodeId = '';
  }

  const [courseData, updateCourseData] = useOutletContext<[CourseTreeTypeNode[],(data:CourseTreeTypeNode)=>void]>();

  const node = findNode(nodeId, courseData);
  const data = node?(node.data as UploadVideoForm):{title:'',description:''};
  const onFormChange = (value: string, key: string) => {
    const onFormChange = (key: string, value: string) => {
      const newData = {
        ...data,
        [key]: value
      };
      const updatedNode = {
        ...node,
        title: newData.title,
        data: newData
      };
  
      updateCourseData(updatedNode);
    }
  }
  const [form] = Form.useForm<{ title: string, description: string}>();

  return (
      <>
   <Form
      form={form}
      layout="vertical"
              initialValues={{ title: '', description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input  onChange={e=>onFormChange('title',e.target.value)} placeholder="Enter Video Title" />
      </Form.Item>
      <Form.Item name='description' label="Description" required>
        <Input onChange={e=>onFormChange('description',e.target.value)} placeholder="Enter Video Description" />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
          </Form>
    </>
  );
};

export default UploadVideoForm;