import { Button, Card, Form, Select, Space } from 'antd'
import { Fragment, useEffect } from 'react'

import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import SunEditor from '@Components/SunEditor/SunEditor'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { uniqueId } from 'lodash'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'
import { useWatch } from 'antd/es/form/Form'

const SIZES = {
  portrait: {
    width: 794,
    height: 1100
  },
landscape: {
  height: 794,
  width: 1100
  }
}

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
  
  const bgImage = useWatch(['background', 'url'], form);
  const layout = useWatch(['layout'], form);
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
      <Form.Item name={['background','url']} label="Background Image" >
           <MediaUpload
                    uploadType="image"
                    name={['background','url']}
            prefixKey={uniqueId()}
                    cropper
                    width="300px"
                    height="200px"
                    renderItem={() => (
                      <Image preview={false} src={bgImage} />
                    )}
            onUpload={(file) => {
              form.setFieldValue(['background', 'url'], file.url);
            }}
                  />
        </Form.Item>
        <Form.Item name={['layout']} label="Layout" >
        <Select
      style={{ width: 300 }}
      options={[
        { value: 'portrait', label: 'Portrait' },
        { value: 'landscape', label: 'Landscape' },
      ]}
    />
        </Form.Item>
        <Form.Item name="template" label="Design">
           {/* @ts-ignore */}
          <SunEditor name="template" {...SIZES[layout]} />
      </Form.Item>
      </Form>
    </Header>
  )
}

export default CertificateTemplateEditor


// function addInlineStyleToSunEditor(html:string, backgroundImageUrl:string) {
//   // Step 1: Create a DOM element from the HTML string
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, 'text/html');
//   const rootElement = doc.body;

//   // Step 2: Find the target div element with the specified class
//   const targetDiv:any = rootElement.querySelector('.sun-editor-editable');

//   // Step 3: Apply the inline style to the div element
//   if (targetDiv) {
//     targetDiv.style.backgroundImage = `url(${backgroundImageUrl})`;
//   }

//   // Step 4: Convert the modified DOM element back to an HTML string
//   return rootElement.innerHTML;
// }
