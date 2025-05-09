import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import BASE_EMAIL_TEMPLATE from './BaseEmailTemplate'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateEmailTemplateComponentPropsI {
  children?: ReactNode;
  data?: Types.EmailTemplate;
  closeModal?: Function;
  onFinish?: (data: Types.EmailTemplate) => void;
}

const CreateEmailTemplate: React.FC<
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
    e.content = BASE_EMAIL_TEMPLATE
    if (props.data) {
      updateEmailTemplate(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
            form.resetFields()
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
        <Form.Item name="subject" required>
          <TextArea label="Template Subject" name={['content']} />
        </Form.Item>
        <Form.Item name="content" label="Body of the email" required>
          <TextArea html
            onChange={(e: any) => form.setFieldValue(['content'], e)}
          />
        </Form.Item>
      </Form>
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

export default CreateEmailTemplate
