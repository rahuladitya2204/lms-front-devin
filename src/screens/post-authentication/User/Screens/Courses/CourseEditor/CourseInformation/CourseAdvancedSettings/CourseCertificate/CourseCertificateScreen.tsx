import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useLayoutEffect } from 'react'
import { Types, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import AddCertificateTemplate from '@User/Screens/CertificateTemplates/AddCertificateTemplate'

const { Title } = Typography
const { useWatch } = Form

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
    name: 'Course Release Date',
    value: 'course.enrolledAt'
  }
]

interface CourseCertificatePropsI {
  courseId: string;
  saveCourse: Function;
  course: Types.Course;
}

function CourseCertificate(props: CourseCertificatePropsI) {
  console.log(props,'props')
  const [form] = Form.useForm()
  const {
    listItems: certificateTemplates
  } = User.Queries.useGetCertificateTemplates()

  useLayoutEffect(
    () => {
      form.setFieldsValue(props.course.certificate)
    },
    [props.course.certificate]
  );
  const certificateId = useWatch(['template'], form);
  return (
    <Card extra={[ <ActionModal cta={<Button
      icon={<PlusOutlined />}
      type="primary"
      style={{ marginLeft: 20 }}
    >
      Create New{' '}
      </Button>}>
      <AddCertificateTemplate/>
   </ActionModal>]} title={<Title level={3} >Certificate</Title>
  }>
        <Form
      onValuesChange={d => {
        props.saveCourse({
          certificate: {
            ...props.course.certificate,
            ...d
          }
        })
      }}
      form={form}
      layout="vertical"
      autoComplete="off"
    >
      <Space size={[0,0]}>
      <Form.Item
        name={['template']}
        label="Certificate Template Design"
      >
        <Select
          allowClear
          style={{ width: 300 }}
          placeholder="Please select certificte template"
          options={certificateTemplates}
        />
      </Form.Item>
          {certificateId ? <>
            <Tooltip placement="right" title={'Edit Template Design'}>
<Button onClick={e => {
          window.open(`../../../../certificate-template/${certificateId}/editor`)
      }} icon={<EditOutlined />} style={{ marginLeft: 10 }}>
          {/* Edit Certificate */}
        </Button></Tooltip>
        </> : null}
      </Space>

      <Form.Item name={['serialNumber', 'type']} label="Serial Number">
        <Radio.Group value={props.course.certificate.serialNumber.type}>
          <Space direction="vertical">
            <Radio value={'random'}>
              <strong>Random</strong>: The serial number will be random
              alphanumeric value of 8 characters.
            </Radio>
            <Radio value={'incremental'}>
              <strong>Incremental</strong> : The serial number will be an
              incremental value
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item name={['issue', 'type']} label="Issue Type">
        <Radio.Group value={props.course.certificate.issue.type}>
          <Space direction="vertical">
            <Radio value={'manual'}>
              <strong>Automatic</strong>: The certificate will be issued to
              learner on completion
            </Radio>
            <Radio value={'automatic'}>
              <strong>Manual</strong> : The certificate will be issued by admin
              only.
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  </Card>
  )
}

export default CourseCertificate
