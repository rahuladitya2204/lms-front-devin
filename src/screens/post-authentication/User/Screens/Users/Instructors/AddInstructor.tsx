import { Button, Form, Input, Modal } from 'antd'
import {
  CreateInstructorPayload,
  Instructor
} from '@Types/Instructor.types'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useCreateInstructor, useUpdateInstructor } from '@User/Api/Instructor/queries';

interface CreateInstructorComponentPropsI {
  children?: ReactNode;
  data?: Instructor;
}

const AddInstructor: React.FC<CreateInstructorComponentPropsI> = props => {
  const {
    mutate: createInstructor,
    isLoading: createInstructorLoading
  } = useCreateInstructor()
  const {
    mutate: updateInstructor,
    isLoading: updateInstructorLoading
  } = useUpdateInstructor()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const onSubmit = (e: CreateInstructorPayload) => {
    if (props.data) {
      updateInstructor({ id: props.data._id, data: e })
    } else {
      createInstructor(e)
    }
    closeModal()
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  return (
    <Fragment>
      <span onClick={showModal}>{props.children}</span>

      <Modal
        footer={[
          <Button
            key="back"
            onClick={() => form.resetFields(['instructorName', 'title'])}
          >
            Clear
          </Button>,
          <Button
            loading={createInstructorLoading || updateInstructorLoading}
            key="submit"
            type="primary"
            onClick={form.submit}
          >
            Submit
          </Button>
        ]}
        title="Add Instructor"
        open={isModalOpen}
        onCancel={closeModal}
      >
        <Form form={form} onFinish={onSubmit} layout="vertical">
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
  )
}

export default AddInstructor
