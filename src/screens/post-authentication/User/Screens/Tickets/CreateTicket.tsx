import { Alert, Button, Form, Input, Modal, Space } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import MediaUpload from '@Components/MediaUpload'

interface CreateTicketComponentPropsI {
  children?: ReactNode;
  data?: Types.Ticket;
  onFinish?: (data: Types.Ticket) => void;
}

const CreateTicket: React.FC<CreateTicketComponentPropsI> = props => {
  const [files, setFiles] = useState<string[]>([])
  const user = Store.useAuthentication(u => u.user)
  const {
    mutate: createTicket,
    isLoading: createTicketLoading
  } = Learner.Queries.useCreateTicket()

  const [form] = Form.useForm()

    const onSubmit = (e: any) => {
        e.files = files;
        createTicket({
        data:e
        }, {
            onSuccess: () => {
                form.resetFields();
        }
        
    })
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  return (
    <Fragment>
      <Form initialValues={{
        contactEmail: user.email,
        contactNo:user.contactNo
      }} form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="subject" label="Subject" required>
          <Input placeholder="Subject of the Ticket" />
        </Form.Item>
        <Form.Item name="category" label="Category" required>
          <Input placeholder="Category of the Ticket" />
        </Form.Item>
        <Form.Item name="description" label="Description" required>
          <Input.TextArea placeholder="Please enter email of the Ticket" />
              </Form.Item>
              <Alert style={{marginBottom:20}} message="Note: Explain the issue in detail" type="warning" />
              <Form.Item name="contactNo" label="Contact Number" required>
          <Input placeholder="Your phone number" />
        </Form.Item>
        <Form.Item name="contactEmail" label="Contact Email" required>
          <Input placeholder="Your email address" />
        </Form.Item>
        <Form.Item label="Upload Files" required>
          <MediaUpload
            uploadType="file"
            prefixKey={`tickets/${user._id}/files`}
            onUpload={({ name, key, url }) => {
                setFiles([...files, url]);
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
        <Button
          loading={createTicketLoading}
          key="submit"

        >
          Cancel
        </Button>
      </Space>
    </Fragment>
  )
}

export default CreateTicket;
