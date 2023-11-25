import { Alert, Button, Form, Input, Select, Space } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import FileList from '@Components/FileList';
import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea';
import useMessage from '@Hooks/useMessage';

interface CreateTicketComponentPropsI {
  children?: ReactNode;
  closeModal?: Function;
  data?: Types.Ticket;
  onFinish?: (data: Types.Ticket) => void;
}

const CreateTicket: React.FC<CreateTicketComponentPropsI> = props => {
  const [files, setFiles] = useState<{ name: string, file: string }[]>([]);
  const message = useMessage();
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
  const {data: learner } = Learner.Queries.useGetLearnerDetails();
  const [form] = Form.useForm()

  const onSubmit = (e: any) => {
    const data = { ...e };
    createTicket(
      {
        data
      },
      {
        onSuccess: () => {
          form.resetFields();
          message.open({
            type: 'success',
            content:'Support Ticket raised'
          })
          props.closeModal && props.closeModal()
          setFiles([]);
        },
        onError: (er:any) => {
          message.open({
            type: 'error',
            content:er.response.data.message
          })
        }
      }
    )
  }

  useEffect(
    () => {
      if (props.data?._id) {
        form.setFieldsValue(props.data)
      }
      else {
        form.setFieldsValue({
          contactNo: learner.contactNo.replace('91',''),
          contactEmail: learner.email
        })
      }
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
        form={form}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Form.Item name="subject" label="Subject" required
          rules={[{ required: true, message: 'Please mention subject of the ticket!' },
          { min: 5, message: 'Subject must be at least 5 characters long' }
        ]}>
          <Input placeholder="Subject of the Ticket" />
        </Form.Item>
        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}
                >
          <Select
            placeholder="Select Category"
            style={{ width: '100%' }}
            options={categoryList}
          />
        </Form.Item>

        {subCategories.length ? <Form.Item name="subCategory" label="Sub Category"
          rules={[{ required: true, message: 'Please select a sub-categor' }]}
>
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
        <Form.Item name="description" label="Description" 
          rules={[{ required: true, message: 'Please add some details about the issue' },
          { min: 5, message: 'Description must be at least 5 characters long' }
        ]}>
          <TextArea height={200} placeholder="Please enter email of the Ticket" />
        </Form.Item>
        {/* <Form.Item name="contactName" label="Contact Name" required>
          <Input placeholder="Your name" />
        </Form.Item> */}
        <Form.Item name="contactNo" label="Contact Number" rules={[
          { required: true, message: 'Please add your contact No!' },
          { pattern: /^(\+\d{1,3}[- ]?)?\d{12}$/, message: 'Invalid phone number' }
        ]} >
          <Input placeholder="Your phone number" />
        </Form.Item>
        <Form.Item name="contactEmail" label="Contact Email"  rules={[{ required: true, message: 'Please add your email address!' }]}>
          <Input placeholder="Your email address" />
        </Form.Item>
        <Form.Item label="Upload Files" required name={'files'}>
          <MediaUpload
            isProtected
            uploadType="file"
            prefixKey={`tickets/${user._id}/files`}
            onUpload={({ _id,name }) => {
              setFiles([...files, { name: name, file: _id }]);
            }}
          />{' '}
        </Form.Item>
        <FileList
              onDeleteFile={fileId => {
                const FILES = files.filter(f => f.file !== fileId)
                setFiles(FILES)
              }}
              files={files}
            />
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['TicketName', 'title'])}
      >
        Clear
      </Button>, */}
      <Space style={{ marginTop: 20 }}>
        <Button block
          loading={createTicketLoading}
          key="submit"
          type="primary"
          onClick={form.submit}
        >
          RAISE TICKET
        </Button>
      </Space>
    </Fragment>
  )
}

export default CreateTicket
