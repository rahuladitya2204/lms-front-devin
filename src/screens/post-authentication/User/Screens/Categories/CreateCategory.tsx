import { Button, Form, Input, Modal, Space } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea'
import { Types } from '@invinciblezealorg/lms-common'
import { User } from '@invinciblezealorg/lms-common'

interface CreateCategoryComponentPropsI {
  children?: ReactNode;
  closeModal?: Function;
  data?: Types.ProductCategory;
}

const CreateCategory: React.FC<CreateCategoryComponentPropsI> = props => {
  const {
    mutate: createCategory,
    isLoading: createCategoryLoading
  } = User.Queries.useCreateProductCategory()
  const {
    mutate: updateCategory,
    isLoading: updateCategoryLoading
  } = User.Queries.useUpdateProductCategory()
  const [form] = Form.useForm()

  const onSubmit = (e: Types.ProductCategory) => {
    const id = props?.data?._id
    const DATA = { ...e }
    if (id) {
      // @ts-ignore
      updateCategory(
        { id: id, data: DATA },
        {
          onSuccess: () => {
            form.resetFields()
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createCategory(
        { data: DATA },
        {
          onSuccess: () => {
            form.resetFields()
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

  const thumbnailImage = Form.useWatch(['thumbnailImage'], form)

  return (
    <Fragment>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Category Title" />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <TextArea placeholder="Category Description" />
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
