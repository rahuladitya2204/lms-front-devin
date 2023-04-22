import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { Fragment, useEffect, useLayoutEffect } from 'react'

import CourseCertificate from '../CourseCertificate/CourseCertificateScreen'
import HtmlEditor from '@Components/HtmlEditor'
import QuillEditor from '@Components/QuillEditor'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import { Types } from '@adewaskar/lms-common'
import { deepPatch } from '../../utils'
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

interface CourseAdvancedSettingsPropsI {
  courseId: string;
  saveCourse: Function;
  course: Types.Course;
}

function CourseAdvancedSettings(props: CourseAdvancedSettingsPropsI) {
  const [form] = Form.useForm()
  const sendEmail = useWatch(['email', 'enabled'], form)

  useLayoutEffect(
    () => {
      form.setFieldsValue(props.course.advanced)
    },
    [props.course]
  )

  return (
    <>
     <Form
      onValuesChange={d => {
        const data = deepPatch(props.course.advanced, d)
        props.saveCourse({
          advanced: data
        })
      }}
      form={form}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item valuePropName="checked" name={['watermark', 'enabled']}>
        <Checkbox>Enable Water Mark</Checkbox>
      </Form.Item>

        <Card bodyStyle={{
          display:sendEmail?'block':'none'
        }} title={<Title level={3}>Email Notification</Title>} extra={
              <Tooltip placement="topLeft" title={`Send email to learner on course enrollment`}>

          <Form.Item style={{margin:0}}
        valuePropName="checked"
        name={['email', 'enabled']}
        // label="Send email to learner on course enrollment."
      >
        <Switch />
            </Form.Item>
          </Tooltip>}>
        
      {sendEmail ? (
        <Fragment>
          <Form.Item name={['email', 'subject']} label="Email Subject">
            <Input />
          </Form.Item>

          <Form.Item name={['email', 'cc']} label="Add Cc">
            <Input />
          </Form.Item>
          <Form.Item name={['email', 'content']} required label="Email Body">
            <SunEditorComponent
              variables={VARIABLES}
              name={['email', 'content']}
            />
          </Form.Item>
        </Fragment>
      ) : null}
</Card>
      </Form>
      <Divider/>
      <CourseCertificate   courseId={props.courseId}
                  course={props.course}
                  saveCourse={props.saveCourse}/>
    </>
  )
}

export default CourseAdvancedSettings
