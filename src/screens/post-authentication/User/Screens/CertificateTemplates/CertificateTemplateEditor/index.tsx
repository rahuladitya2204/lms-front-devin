import { Button, Card, Form } from 'antd'
import { Fragment, useEffect } from 'react'

import CertificateTemplateDetailsEditor from './CertificateTemplateDetailsEditor'
import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

function CertificateTemplateEditor() {
  const message = useMessage()
  const { id: emailTemplateId } = useParams()
  const {
    mutate: updateCertificateTemplate,
    isLoading: loading
  } = User.Queries.useUpdateCertificateTemplate()

  const { data: template } = User.Queries.useGetCertificateTemplateDetails(
    emailTemplateId + '',
    {
      enabled: !!emailTemplateId
    }
  )

  const saveCertificateTemplate = (data: Types.CertificateTemplate) => {
    updateCertificateTemplate(
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
  const [form] = Form.useForm<Types.CertificateTemplate>();

  useEffect(() => {
    console.log(template,1212)
    form.setFieldsValue(template);
  },[template])

  return (
    <Header
      title="Certificate Template Editor"
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
      <Form initialValues={template} form={form} onFinish={saveCertificateTemplate} layout="vertical" autoComplete="off">
        <Card>
          <CertificateTemplateDetailsEditor id={template._id} />
        </Card>
      </Form>
    </Header>
  )
}

export default CertificateTemplateEditor
