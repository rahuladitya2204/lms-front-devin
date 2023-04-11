import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import QuillEditor from '@Components/QuillEditor'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateEmailTemplateComponentPropsI {
  children?: ReactNode;
  data?: Types.EmailTemplate;
  closeModal?: Function;
  onFinish?: (data: Types.EmailTemplate) => void;
}

const AddEmailTemplate: React.FC<
  CreateEmailTemplateComponentPropsI
> = props => {
  const {
    mutate: createEmailTemplate,
    isLoading: createEmailTemplateLoading
  } = User.Queries.useCreateEmailTemplate()
  const {
    mutate: updateEmailTemplate,
    isLoading: updateEmailTemplateLoading
  } = User.Queries.useUpdateEmailTemplate()

  const [form] = Form.useForm()

  const onSubmit = (e: Types.CreateEmailTemplatePayload) => {
    if (props.data) {
      updateEmailTemplate(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
            form.resetFields();
          }
        }
      )
    } else {
      createEmailTemplate(e, {
        onSuccess: () => {
          props.closeModal && props.closeModal()
        }
      })
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
        <Form.Item name="title" label="Template Title" required>
          <Input placeholder="Title of the Template" />
        </Form.Item>
        <Form.Item name="description" label="Template Description" required>
          <Input placeholder="Title of the Template" />
        </Form.Item>
        <Form.Item name="subject" label="Template Subject" required>
          <Input placeholder="Subject of the email" />
        </Form.Item>
        <Form.Item name="content" label="Body of the email" required>
          <QuillEditor />
        </Form.Item>
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['instructorName', 'title'])}
      >
        Clear
      </Button>, */}
      <Button
        loading={createEmailTemplateLoading || updateEmailTemplateLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Fragment>
  )
}

export default AddEmailTemplate
