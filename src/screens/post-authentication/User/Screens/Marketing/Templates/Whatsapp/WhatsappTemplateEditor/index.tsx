import { Button, Card, Form } from 'antd'
import { Fragment, useEffect } from 'react'

import Header from '@Components/Header'
import { Types } from '@invinciblezealorg/lms-common'
import { User } from '@invinciblezealorg/lms-common'
import WhatsappTemplateDetailsEditor from './WhatsappTemplateDetailsEditor'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

function WhatsappTemplateEditor() {
  const message = useMessage()
  const { id: emailTemplateId } = useParams()
  const {
    mutate: updateWhatsappTemplate,
    isLoading: loading
  } = User.Queries.useUpdateWhatsappTemplate()

  const { data: template } = User.Queries.useGetWhatsappTemplateDetails(
    emailTemplateId + '',
    {
      enabled: !!emailTemplateId
    }
  )

  const saveWhatsappTemplate = (data: Types.WhatsappTemplate) => {
    updateWhatsappTemplate(
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
  const [form] = Form.useForm<Types.WhatsappTemplate>();

  useEffect(() => {
    form.setFieldsValue(template);
  },[template])

  return (
    <Header
      title="Whatsapp Template Editor"
      extra={[
        <Fragment>
          <Button
            loading={loading}
            onClick={form.submit}
          >
            Save as Draft
          </Button>
          <Button
            loading={loading}
            type="primary"
          >
            Publish Template
          </Button>
        </Fragment>
      ]}
    >
      <Form initialValues={template} form={form} onFinish={saveWhatsappTemplate} layout="vertical" autoComplete="off">
        <Card extra={<Button danger>Send test Mail</Button>}>
          <WhatsappTemplateDetailsEditor id={template._id} />
        </Card>
      </Form>
    </Header>
  )
}

export default WhatsappTemplateEditor
