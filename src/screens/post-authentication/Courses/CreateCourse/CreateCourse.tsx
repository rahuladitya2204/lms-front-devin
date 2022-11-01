import { Button, Form, Input, Modal, Radio } from 'antd';
import React, { useState } from 'react';

import { CreateCoursePayload } from '../../../../types/Courses.types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useCreateCourse } from '../../../../queries/Courses/CoursesQueries';

const CreateCourseComponent: React.FC = () => {
    const {mutate:createCourse,isLoading: loading }=useCreateCourse()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();

    const onSubmit = (e:CreateCoursePayload) => {
        createCourse({
            instructorName: e.instructorName,
            title: e.title
        });
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Course
      </Button>
      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['instructorName','title'])}>
            Clear
          </Button>,
          <Button loading={loading} key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
        ]} title="Create Course" open={isModalOpen} onCancel={handleCancel}>
      <Form
                  form={form}
                  onFinish={onSubmit}
        layout="vertical"
      >
        <Form.Item name="title" label="Title" required tooltip="Title of your course">
        <Input placeholder="Enter your course title" />
        </Form.Item>
        <Form.Item
          label="Instructor"
          name="instructorName"
          tooltip={{
            title: 'Instructor name',
            icon: <InfoCircleOutlined />
          }}
        >
          <Input placeholder="Enter Instructor Nme" />
        </Form.Item>
      </Form>
      </Modal>
    </>
  );
};

export default CreateCourseComponent;