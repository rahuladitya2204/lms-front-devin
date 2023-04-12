import { Alert, Button, Form, Input, Select, Space } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import MediaUpload from '@Components/MediaUpload'

interface CreateTicketComponentPropsI {
  children?: ReactNode;
  closeModal?: Function;
  data?: Types.Ticket;
  onFinish?: (data: Types.Ticket) => void;
}

const CreateTicket: React.FC<CreateTicketComponentPropsI> = props => {
    const [files, setFiles] = useState<Partial<Types.FileType>[]>([]);
  const user = Store.useAuthentication(u => u.user)
  const {
    mutate: createTicket,
    isLoading: createTicketLoading
  } = Learner.Queries.useCreateTicket()

  const {
    data: categories
  } = Learner.Queries.useGetTicketCategories()
    const categoryList = categories.filter(cat => !cat.parentCategory).map(cat => {
        return {
            label: cat.title,
            value:cat._id
      }
  });

  const [form] = Form.useForm()

  const onSubmit = (e: any) => {
    e.files = files
    console.log(files, 'files')
    createTicket(
      {
        data: e
      },
      {
        onSuccess: () => {
          form.resetFields()
          props.closeModal && props.closeModal()
        }
      }
    )
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )
  const category = Form.useWatch('category', form)
    const subCategories = categories.filter((cat) => category&&cat.parentCategory === category).map(c => {
        return {
            label: c.title,
            value:c._id
        }
    });
  return (
    <Fragment>
      <Form
        initialValues={{
          contactEmail: user.email,
          contactNo: user.contactNo
        }}
        form={form}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Form.Item name="subject" label="Subject" required>
          <Input placeholder="Subject of the Ticket" />
        </Form.Item>
        <Form.Item name="category" label="Category" required>
          <Select
            placeholder="Select Category"
            style={{ width: '100%' }}
            options={categoryList}
          />
        </Form.Item>

        {subCategories.length?<Form.Item name="subCategory" label="Sub Category" required>
          <Select
            placeholder="Select Sub Category"
            // defaultValue="lucy"
            style={{ width: '100%' }}
            options={subCategories}
          />
        </Form.Item>:null}

        <Alert
          style={{ marginBottom: 20 }}
          message="Note: Explain the issue in detail"
          type="warning"
        />
        <Form.Item name="description" label="Description" required>
          <Input.TextArea placeholder="Please enter email of the Ticket" />
        </Form.Item>
        {/* <Form.Item name="contactName" label="Contact Name" required>
          <Input placeholder="Your name" />
        </Form.Item> */}
        <Form.Item name="contactNo" label="Contact Number" required>
          <Input placeholder="Your phone number" />
        </Form.Item>
        <Form.Item name="contactEmail" label="Contact Email" required>
          <Input placeholder="Your email address" />
        </Form.Item>
        <Form.Item label="Upload Files" required>
          <MediaUpload
            isProtected
            uploadType="file"
            prefixKey={`tickets/${user._id}/files`}
            onUpload={({ name, key, url, isProtected }) => {
              setFiles([...files, { name, url, key, isProtected }])
            }}
          />{' '}
        </Form.Item>
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['TicketName', 'title'])}
      >
        Clear
      </Button>, */}
      <Space style={{ marginTop: 20 }}>
        <Button
          loading={createTicketLoading}
          key="submit"
          type="primary"
          onClick={form.submit}
        >
          RAISE TICKET
        </Button>
        <Button loading={createTicketLoading} key="submit">
          Cancel
        </Button>
      </Space>
    </Fragment>
  )
}

export default CreateTicket
