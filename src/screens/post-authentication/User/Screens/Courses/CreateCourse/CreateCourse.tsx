import { Button, Form, Input, Modal, Select } from 'antd'
import React, { ReactNode } from 'react'

import { InfoCircleOutlined } from '@ant-design/icons'
import { Learner, Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateCourseComponentPropsI {
  children?: ReactNode;
  closeModal?: any;
}

const CreateCourseComponent: React.FC<CreateCourseComponentPropsI> = props => {
  const {
    mutate: createCourse,
    isLoading: loading
  } = User.Queries.useCreateCourse()
  const [form] = Form.useForm()

  const onSubmit = (e: Types.Course) => {
    createCourse(
      e,
      {
        onSuccess: () => {
          props.closeModal && props.closeModal()
        }
      }
    )
  }

  const { listItems: categories } = User.Queries.useGetCourseCategories()

  // const { listItems: instructors } = User.Queries.useGetInstructors()
  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        required
        tooltip="Title of your course"
        rules={[{ required: true, message: 'Please mention title for course' }]}
      >
        <Input placeholder="Enter your course title" />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category!' }]}
      >
        <Select
          placeholder="Select Category"
          style={{ width: '100%' }}
          options={categories}
        />
      </Form.Item>
      {/* <Form.Item
        label="Instructor"
        name="instructor"
        rules={[
          { required: true, message: 'Please mention instructor for course' }
        ]}
        tooltip={{
          title: 'Instructor name',
          icon: <InfoCircleOutlined />
        }}
      >
        <Select options={instructors} />
      </Form.Item> */}
      <Button
        loading={loading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  )
}

export default CreateCourseComponent
