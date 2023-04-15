import { Button, Form, Input, Select } from 'antd'
import React, { Fragment, ReactNode, useEffect } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateTicketCategoryComponentPropsI {
  children?: ReactNode;
  data?: Types.TicketCategory;
  closeModal?: Function;
  onFinish?: (data: Types.TicketCategory) => void;
}

const AddTicketCategory: React.FC<
  CreateTicketCategoryComponentPropsI
> = props => {
  const {
    mutate: createTicketCategory,
    isLoading: createTicketCategoryLoading
  } = User.Queries.useCreateTicketCategory()
  const {
    mutate: updateTicketCategory,
    isLoading: updateTicketCategoryLoading
  } = User.Queries.useUpdateTicketCategory()

  const { listItems: categories } = User.Queries.useGetTicketCategories()

  const [form] = Form.useForm()

  const onSubmit = (e: Partial<Types.TicketCategory>) => {
    if (props.data) {
      updateTicketCategory(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createTicketCategory(
        { data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    }
    // onFinish && onFinish(e)
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
        <Form.Item name="parentCategory" label="Parent Category" required>
          <Select
            placeholder="Select Parent Category"
            // defaultValue="lucy"
            style={{ width: '100%' }}
            // onChange={handleChange}
            options={categories}
          />
        </Form.Item>
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Category Title" />
        </Form.Item>
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['TicketCategoryName', 'title'])}
      >
        Clear
      </Button>, */}
      <Button
        loading={createTicketCategoryLoading || updateTicketCategoryLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Fragment>
  )
}

export default AddTicketCategory
