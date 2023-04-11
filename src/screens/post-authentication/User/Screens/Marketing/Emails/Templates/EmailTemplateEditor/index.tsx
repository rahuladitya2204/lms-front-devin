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

  const { data } = User.Queries.useGetEmailTemplateDetails(
    emailTemplateId + '',
    {
      enabled: !!emailTemplateId
    }
  )

  useEffect(
    () => {
      setEmailTemplate(data)
    },
    [data]
  )

  const saveEmailTemplate = (data: Types.EmailTemplate) => {
    updateEmailTemplate(
      {
        id: emailTemplateId + '',
        data: data
      },
      {
        onSuccess: () => {
          console.log('Saving EmailTemplate!')
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
      <Card>
        <EmailTemplateDetailsEditor
          formData={emailTemplate}
          onFormUpdate={onFormUpdate}
        />
      </Card>
    </Header>
  )
}

export default EmailTemplateEditor
