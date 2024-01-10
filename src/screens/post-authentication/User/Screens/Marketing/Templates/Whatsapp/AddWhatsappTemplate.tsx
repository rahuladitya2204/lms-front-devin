import { Button, Form, Image, Input, Modal, Select } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import MediaUpload from '@Components/MediaUpload'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateWhatsappTemplateComponentPropsI {
  children?: ReactNode;
  templateId?: string;
  closeModal?: Function;
  onFinish?: (data: Types.WhatsappTemplate) => void;
}

const categories = [
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Transactional', value: 'TRANSACTIONAL' }
]

const languages = [
  { label: 'English', value: 'en' }
  // { label: 'Transactional', value: 'TRANSACTIONAL' }
]

const AddWhatsappTemplate: React.FC<
  CreateWhatsappTemplateComponentPropsI
> = props => {
  // const { }
  const { data: template } = User.Queries.useGetWhatsappTemplateDetails(
    props.templateId + '',
    {
      enabled: !!props.templateId
    }
  )

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
    if (template._id) {
      updateWhatsappTemplate(
        { id: template._id, data: e },
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
  }

  useEffect(
    () => {
      form.setFieldsValue(template)
    },
    [template]
  )
  const mediaUrl = Form.useWatch(['mediaUrl'], form)
  return (
    <Fragment>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="name" label="Template Name" required>
          <Input placeholder="Name of the Template" />
        </Form.Item>
        <Form.Item name="category" label="Template Category" required>
          <Select options={categories} />
        </Form.Item>
        <Form.Item name="language" label="Language" required>
          <Select options={languages} />
        </Form.Item>
        <Form.Item name="mediaUrl" required label="Media">
          <MediaUpload
            uploadType="image"
            // cropper
            aspect={16 / 9}
            onUpload={({ name, _id, url }) => {
              form.setFieldValue('mediaUrl', url)
            }}
            name="mediaUrl"
            width="250px"
            renderItem={() => <Image preview={false} src={mediaUrl} />}
          />
        </Form.Item>
        <Form.Item name="headerText" label="Header Text" required>
          <Input placeholder="Enter header text" />
        </Form.Item>
        <Form.Item name="bodyText" label="Body Text" required>
          <Input placeholder="Enter body text" />
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
