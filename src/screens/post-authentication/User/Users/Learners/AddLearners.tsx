import { Button, Form, Input, Modal } from 'antd';
import { CreateLearnerPayload, Learner } from '../../../../../types/Learner.types';
import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useCreateLearner, useUpdateLearner } from '../../../../../network/Learner/queries';

import QuillEditor from '../../../../../components/QuillEditor';

interface CreateLearnerComponentPropsI {
  children?: ReactNode;
  data?: Learner;
}

const AddLearner: React.FC<CreateLearnerComponentPropsI> = (props) => {
  const {mutate: createLearner,isLoading: createLearnerLoading }=useCreateLearner()
  const {mutate: updateLearner,isLoading: updateLearnerLoading }=useUpdateLearner()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (e: CreateLearnerPayload) => {
    if (props.data)
    {
      updateLearner({ id: props.data._id, data: e });
    }
    else {
      createLearner(e);
    }
    closeModal();
  }

  useEffect(() => { 
    form.setFieldsValue(props.data)
  },[props.data])

  return (
    <Fragment>
      <span onClick={showModal}>
        {props.children}
      </span>

      <Modal footer={[
          <Button key="back" onClick={()=>form.resetFields(['instructorName','title'])}>
            Clear
          </Button>,
          <Button loading={createLearnerLoading || updateLearnerLoading} key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>,
        ]} title="Add Learner" open={isModalOpen} onCancel={closeModal}>
      <Form
                  form={form}
                  onFinish={onSubmit}
        layout="vertical"
      >
        <Form.Item name="name" label="Name" required>
        <Input placeholder="Name of the instructor" />
          </Form.Item>
          <Form.Item name="designation" label="Designation" required>
        <Input placeholder="Designation of the instructor" />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
        <Input placeholder="Please enter email of the instructor" />
        </Form.Item>
      </Form>
      </Modal>
    </Fragment>
  );
};

export default AddLearner;