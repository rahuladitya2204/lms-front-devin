// @ts-nocheck
import { Button, Card, Tabs } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

import EmailTemplateDetailsEditor from './EmailTemplateDetailsEditor'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function EmailTemplateEditor() {
  const navigate = useNavigate()
  const message = useMessage()
  const { id: emailTemplateId } = useParams()
  const [emailTemplate, setEmailTemplate] = useState(
    Constants.INITIAL_EMAIL_TEMPLATE_DETAILS
  )
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

  useEffect(
    () => {
      setEmailTemplate(template)
    },
    [template]
  )

  const saveEmailTemplate = (data: Types.EmailTemplate) => {
    delete data.variables
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
          navigate('../')
        }
      }
    )
  }

  const onFormUpdate = (data: Partial<Types.EmailTemplate>) => {
    setEmailTemplate({
      ...emailTemplate,
      ...data
    })
  }
  // console.log(template, 'temp')
  return (
    <Header
      title="Email Template Editor"
      extra={[
        <Fragment>
          <Button
            loading={loading}
            onClick={() => saveEmailTemplate(emailTemplate)}
          >
            Save as Draft
          </Button>
          {template.title}
          <Button
            onClick={() =>
              saveEmailTemplate({
                ...emailTemplate,
                status: 'live'
              })
            }
            loading={loading}
            type="primary"
          >
            Publish Template
          </Button>
        </Fragment>
      ]}
    >
      <Card extra={<Button danger>Send Test Mail</Button>}>
        <EmailTemplateDetailsEditor
          formData={emailTemplate}
          onFormUpdate={onFormUpdate}
        />
      </Card>
    </Header>
  )
}

export default EmailTemplateEditor
