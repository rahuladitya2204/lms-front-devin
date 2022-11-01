import { Button, Form, Input } from 'antd';
import { useOutletContext, useParams } from 'react-router-dom';

import { CourseTreeTypeNode } from '../../../../../types/Common.types';
import QuillEditor from '../../../../../components/QuillEditor';
import React from 'react';
import { findNode } from '../../utils';

interface UploadVideoForm {
  title: string;
  context: string;
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
  const data = node?(node.data as UploadVideoForm):{title:'',description:'',context:''};
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
  const [form] = Form.useForm<{ title: string, description: string,context:string}>();

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
      <QuillEditor onChange={e => onFormChange('description', e)} value={data.description} />
        </Form.Item>
        <Form.Item name='context' label="Context" required>
      <QuillEditor onChange={e => onFormChange('context', e)} value={data.context} />
      </Form.Item>

          </Form>
    </>
  );
};

export default UploadVideoForm;