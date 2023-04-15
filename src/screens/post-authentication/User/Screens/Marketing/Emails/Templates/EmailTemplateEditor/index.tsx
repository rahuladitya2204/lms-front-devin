import { Button, Card, Form, Tabs } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

import EmailTemplateDetailsEditor from './EmailTemplateDetailsEditor'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function EmailTemplateEditor() {
  const message = useMessage()
  const { id: emailTemplateId } = useParams()
  const {
    mutate: updateEmailTemplate,
    isLoading: loading
  } = User.Queries.useUpdateEmailTemplate()

  const { data: template } = User.Queries.useGetEmailTemplateDetails(
    emailTemplateId + '',
    {
      enabled: !!emailTemplateId
    }
  )

  const saveEmailTemplate = (data: Types.EmailTemplate) => {
    updateEmailTemplate(
      {
        id: emailTemplateId + '',
        data: data
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved'
          })
          // navigate('../')
        }
      }
    )
  }
  const [form] = Form.useForm<Types.EmailTemplate>();

  useEffect(() => {
    console.log(template,1212)
    form.setFieldsValue(template);
  },[template])

  return (
    <Header
      title="Email Template Editor"
      extra={[
        <Fragment>
          <Button
            loading={loading}
            onClick={form.submit}
          >
            Save as Draft
          </Button>
          <Button
            // onClick={() =>
            //   saveEmailTemplate({
            //     ...emailTemplate,
            //     status: 'live'
            //   })
            // }
            loading={loading}
            type="primary"
          >
            Publish Template
          </Button>
        </Fragment>
      ]}
    >
      <Form initialValues={template} form={form} onFinish={saveEmailTemplate} layout="vertical" autoComplete="off">
        <Card extra={<Button danger>Send Test Mail</Button>}>
          <EmailTemplateDetailsEditor template={template} />
        </Card>
      </Form>
    </Header>
  )
}

export default EmailTemplateEditor
