import { Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';

import { CourseTreeTypeNode } from '../../../../../types/Common.types';
import QuillEditor from '../../../../../components/QuillEditor';
import { findNode } from '../../utils';
import useUploadItemForm from '../hooks/useUploadItemForm';

interface AddTextItemForm {
  title: string;
  description: string;
}

const AddTextItem: React.FC = () => {
  const { onFormChange, form, data } = useUploadItemForm<AddTextItemForm>( { title: '', description: ''});
  return (
      <>
   <Form
        form={form}
      layout="vertical"
              initialValues={{ title: data.title, description:'' }}
    >
      <Form.Item name='title' label="Title" required tooltip="This is a required field">
        <Input value={data.title} onChange={(e)=>onFormChange('title',e.target.value)} placeholder="Enter Text Content's title" />
      </Form.Item>
      </Form>
      <Form.Item>
      <QuillEditor onChange={e => onFormChange('description', e)} value={data.description} />
      </Form.Item>
      <Form.Item>
      </Form.Item>
    </>
  );
};

export default AddTextItem;