import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import TextArea from '@Components/Textarea';
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateCertificateTemplateComponentPropsI {
  children?: ReactNode;
  data?: Types.CertificateTemplate;
  closeModal?: Function;
  onFinish?: (data: Types.CertificateTemplate) => void;
}

const AddCertificateTemplate: React.FC<
  CreateCertificateTemplateComponentPropsI
> = props => {
  const {
    mutate: createCertificateTemplate,
    isLoading: createCertificateTemplateLoading
  } = User.Queries.useCreateCertificateTemplate()
  const {
    mutate: updateCertificateTemplate,
    isLoading: updateCertificateTemplateLoading
  } = User.Queries.useUpdateCertificateTemplate()

  const [form] = Form.useForm()

  const onSubmit = (e: Types.CreateCertificateTemplatePayload) => {
    // e.content = BASE_CERTIFICATE_TEMPLATE
    if (props.data) {
      updateCertificateTemplate(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
            form.resetFields()
          }
        }
      )
    } else {
      createCertificateTemplate(e, {
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
          <TextArea html name="content" />
        </Form.Item>
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['instructorName', 'title'])}
      >
        Clear
      </Button>, */}
      <Button
        loading={createCertificateTemplateLoading || updateCertificateTemplateLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Fragment>
  )
}

export default AddCertificateTemplate
