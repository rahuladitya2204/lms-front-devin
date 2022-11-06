import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, ReactNode, useState } from 'react';

import { CreateInstructorPayload } from '../../../../../types/Instructor.types';
import QuillEditor from '../../../../../components/QuillEditor';
import { useCreateInstructor } from '../../../../../queries/Instructor/queries';

interface CreateInstructorComponentPropsI {
  children?: ReactNode;
}

const AddInstructor: React.FC<CreateInstructorComponentPropsI> = (props) => {
    const {mutate: createInstructor,isLoading: loading }=useCreateInstructor()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();

  const onSubmit = (e: CreateInstructorPayload) => {
    createInstructor(e);
    closeModal();
  }
  return (
    <>
      <span onClick={showModal}>
        {props.children}
      </span>

      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['instructorName','title'])}>
            Clear
          </Button>,
          <Button loading={loading} key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
        ]} title="Add Instructor" open={isModalOpen} onCancel={closeModal}>
      <Form
                  form={form}
                  onFinish={onSubmit}
        layout="vertical"
      >
        <Form.Item name="name" label="Name" required>
        <Input placeholder="Name of the instructor" />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
        <Input placeholder="Please enter email of the instructor" />
        </Form.Item>
        <Form.Item required
          label="About the Instructor"
          name="aboutMe"
        >
            <QuillEditor onChange={e => form.setFieldValue('aboutMe', e)} />
          </Form.Item>
      </Form>
      </Modal>
    </>
  );
};

export default AddInstructor;