import { Button, Card, Form } from 'antd'
import { Fragment, useEffect } from 'react'

import Header from '@Components/Header'
import HtmlEditor from '@Components/HtmlEditor'
import SunEditor from '@Components/SunEditor/SunEditor'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

const VARIABLES = [
  {
    name: 'Course Title',
    value: 'course.title'
  },
  {
    name: 'Course Instructor',
    value: 'course.instructor.name'
  },
  {
    name: 'Learner Name',
    value: 'title'
  },
  {
    name: 'Course Completion Date',
    value: 'course.completedAt'
  }
]

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
    console.log(data.template, 'daaaa');
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
    console.log(template,'teee')
    form.setFieldsValue(template);
  }, [template]);
  
  return (
    <Header
      title={template.title}
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
      <Form form={form} onFinish={saveCertificateTemplate} layout="vertical" autoComplete="off">
      <Form.Item name="template">
          <SunEditor name="template" />
      </Form.Item>
      </Form>
    </Header>
  )
}

export default CertificateTemplateEditor
