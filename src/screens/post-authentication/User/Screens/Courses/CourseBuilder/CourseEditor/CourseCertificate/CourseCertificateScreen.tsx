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
  Typography
} from 'antd'
import { Fragment, useEffect, useLayoutEffect } from 'react'
import { Types, User } from '@adewaskar/lms-common'

import { Text } from 'yjs'
import { useParams } from 'react-router'

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
  const [form] = Form.useForm()
  const {
    listItems: certificateTemplates
  } = User.Queries.useGetCertificateTemplates()

  useLayoutEffect(
    () => {
      console.log(props.course.certificate, 'props.course.certificate')
      form.setFieldsValue(props.course.certificate)
    },
    [props.course.certificate]
  )
  return (
    <Form
      onValuesChange={d => {
        console.log(d, 'dd')
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
      <Form.Item
        // valuePropName="checked"
        name={['template']}
        label="Certificate Template Design"
      >
        <Select
          allowClear
          style={{ width: 300 }}
          placeholder="Please select certificte template"
          // onChange={handleChange}
          options={certificateTemplates}
        />
      </Form.Item>

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
  )
}

export default CourseCertificate
