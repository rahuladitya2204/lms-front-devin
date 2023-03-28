import { Button, Form, Input, Modal, Space } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateCategoryComponentPropsI {
  children?: ReactNode;
  data?: Types.CourseCategory;
  onFinish?: () => void;
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
  const [form] = Form.useForm()

  const onSubmit = (e: Types.CourseCategory) => {
    if (props.data) {
      updateCategory({ id: props.data._id, data: e })
    } else {
      createCategory({ data: e })
    }
    props.onFinish && props.onFinish()
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  return (
    <Fragment>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Category Title" />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <Input placeholder="Category Description" />
        </Form.Item>
        <Space>
          <Button
            loading={createCategoryLoading || updateCategoryLoading}
            key="submit"
            type="primary"
            onClick={form.submit}
          >
            Submit
          </Button>
        </Space>
      </Form>
    </Fragment>
  )
}

export default CreateCategory
