import { Button, DatePicker, Form, Input, Modal, Select, Space } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

interface CreatePackageComponentPropsI {
  children?: ReactNode;
  data?: Types.Package;
  closeModal?: Function;
  onFinish?: (data: Types.Package) => void;
}
const { Option } = Select

const CreatePackage: React.FC<CreatePackageComponentPropsI> = props => {
  const {
    mutate: createPackage,
    isLoading: createPackageLoading
  } = User.Queries.useCreatePackage()
  const {
    mutate: updatePackage,
    isLoading: updatePackageLoading
  } = User.Queries.useUpdatePackage()
  const { listItems: courses } = User.Queries.useGetCourses()
  const [form] = Form.useForm()

  const onSubmit = (e: Types.Package) => {
    console.log(e, 'ee')
    if (props.data) {
      updatePackage(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createPackage(
        { data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    }
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
        <Form.Item name={'name'} label="Package Name" required>
          <Input placeholder="Enter package name" />
        </Form.Item>
        <Form.Item name={['courses']} label="Select Courses" required>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Courses"
            optionLabelProp="label"
          >
            {courses.map(course => {
              return (
                <Option value={course.value} label={course.label}>
                  {course.label}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
      <Button
        loading={createPackageLoading || updatePackageLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Fragment>
  )
}

export default CreatePackage
