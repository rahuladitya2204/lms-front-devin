import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateCategoryComponentPropsI {
  children?: ReactNode;
  data?: Types.CourseCategory;
}

const CreateCategory: React.FC<CreateCategoryComponentPropsI> = props => {
  const {
    mutate: createCategory,
    isLoading: createCategoryLoading
  } = User.Queries.useCreateCourseCategory()
  const {
    mutate: updateCategory,
    isLoading: updateCategoryLoading
  } = User.Queries.useUpdateCourseCategory()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const onSubmit = (e: Types.CourseCategory) => {
    if (props.data) {
      updateCategory({ id: props.data._id, data: e })
    } else {
      createCategory({ data: e })
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
            loading={createCategoryLoading || updateCategoryLoading}
            key="submit"
            type="primary"
            onClick={form.submit}
          >
            Submit
          </Button>
        ]}
        title="Create New Category"
        open={isModalOpen}
        onCancel={closeModal}
      >
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Form.Item name="title" label="Title" required>
            <Input placeholder="Category Title" />
          </Form.Item>
          <Form.Item name="description" label="Description" required>
            <Input placeholder="Category Description" />
          </Form.Item>
          {/* <Form.Item name="email" label="Email" required>
            <Input placeholder="Please enter email of the instructor" />
          </Form.Item> */}
        </Form>
      </Modal>
    </Fragment>
  )
}

export default CreateCategory
