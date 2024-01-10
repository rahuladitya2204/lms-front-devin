import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateWhatsappTemplateComponentPropsI {
  children?: ReactNode;
  data?: Types.WhatsappTemplate;
  closeModal?: Function;
  onFinish?: (data: Types.WhatsappTemplate) => void;
}

const AddWhatsappTemplate: React.FC<
  CreateWhatsappTemplateComponentPropsI
> = props => {
  const {
    mutate: createWhatsappTemplate,
    isLoading: createWhatsappTemplateLoading
  } = User.Queries.useCreateWhatsappTemplate()
  const {
    mutate: updateWhatsappTemplate,
    isLoading: updateWhatsappTemplateLoading
  } = User.Queries.useUpdateWhatsappTemplate()

  const [form] = Form.useForm()

  const onSubmit = (e: Types.CreateWhatsappTemplatePayload) => {
    // e.content = BASE_EMAIL_TEMPLATE
    if (props.data) {
      updateWhatsappTemplate(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
            form.resetFields()
          }
        }
      )
    } else {
      createWhatsappTemplate(e, {
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
          <Input placeholder="Subject of the whatsapp" />
        </Form.Item>
        <Form.Item name="content" label="Body of the whatsapp" required>
          <TextArea html
            onChange={(e: any) => form.setFieldValue(['content'], e)}
          />
        </Form.Item>
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['userName', 'title'])}
      >
        Clear
      </Button>, */}
      <Button
        loading={createWhatsappTemplateLoading || updateWhatsappTemplateLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Fragment>
  )
}

export default AddWhatsappTemplate
