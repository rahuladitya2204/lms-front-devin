import { Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';

import { CourseTreeTypeNode } from '../../../../../types/Common.types';
import QuillEditor from '../../../../../components/QuillEditor';
import { findNode } from '../../utils';

interface AddTextItemForm {
  title: string;
  description: string;
}

const AddTextItem: React.FC = () => {

  const [searchParams] = useSearchParams();
  const nodeId = searchParams.get("nodeId") || '';


  const [courseData, updateCourseData] = useOutletContext<[CourseTreeTypeNode[],(data:CourseTreeTypeNode)=>void]>();

  const node = findNode(nodeId, courseData);
  const data = node?(node.data as AddTextItemForm):{title:''};
  
  const onFormChange = (key: string, value: string) => {
    const updatedNode = {
      ...node,
      title: data.title,
      data: {
        ...data,
        [key]: value
      }
    };
    console.log(updatedNode,'updated')
    updateCourseData(updatedNode);
  }

  // useEffect(() => { 
  //   form.setFieldsValue(data)
  // },[data])
    
    const [form] = Form.useForm<{ title: string }>();
  console.log(data,'ddddd')
  return (
      <>
   <Form
        form={form}
      layout="vertical"
              initialValues={{ title: data.title, description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input onChange={(e)=>onFormChange('title',e.target.value)} placeholder="input placeholder" />
      </Form.Item>
      </Form>
      <Form.Item>
      <QuillEditor onChange={e => onFormChange('description', e)} value={form.getFieldValue('description')} />
      </Form.Item>
      <Form.Item>
      </Form.Item>
    </>
  );
};

export default AddTextItem;