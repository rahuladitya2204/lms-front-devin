import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

import { QUESTION_TYPES } from '../AddQuestionItem';
import TextArea from '@Components/Textarea';
import { Types } from '@adewaskar/lms-common';
import { useTestStore } from '../hooks/useTestStore';

interface AddTestSectionPropsI{
  closeModal?: Function;
  data?: Types.TestSection;
  onFinish: (data: Types.TestSection) => void;
}

const AddTestSection: React.FC<AddTestSectionPropsI> = (props) => { 
  const updateSection = useTestStore(s => s.updateSection)
  const [form] = Form.useForm<Types.TestSection>();
  const { closeModal } = props;
    const onSubmit = (data:Types.TestSection) => {
      form.resetFields();
      if (props.data?._id) {
        updateSection(props.data?._id, data);
      }
      else {
        props.onFinish&&props.onFinish(data);
      }
      closeModal && closeModal();
    }
    
  
  useEffect(() => {
    if (props.data) {
      form.setFieldsValue(props.data);
    }
  }, [props.data, form]);


  return (
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
    <Form.Item required name="title" label="Section Title">
      <Input placeholder='Please enter heading for the new section' />
      </Form.Item>

      <Form.Item required name="commonDetail" label="Section Detail">
    <TextArea height={300} html={{level:3}} />
      </Form.Item>
      <Row gutter={[20,20]}>
      <Col span={12}>
            <Form.Item label='Question Type' name={'type'}>
              <Select
                style={{ width: '100%' }}
                options={QUESTION_TYPES}
              />

            </Form.Item>
          </Col>
      <Col span={12}>
            <Form.Item name={['score', 'correct']} label="Correct Answer Score" required rules={[
              {
                required: true,
                message: "Enter the correct score for this question"
            
              },
            ]}>
              <Input placeholder="Enter the score for this question" />
            </Form.Item>
          </Col>
      <Col span={12}>
            <Form.Item name={['score', 'incorrect']} label="Incorrect Answer Score" required rules={[
              {
                required: true,
                message: "Enter the incorrect score for this question"
              }
            ]}>
              <Input placeholder="Enter the score for this question" />
            </Form.Item>
          </Col>
      </Row>
      <Row justify={'end'}>
        <Col>
        <Button type='primary' onClick={form.submit} >Save Section</Button>
</Col>
</Row>
    </Form>
  );
};

export default AddTestSection;