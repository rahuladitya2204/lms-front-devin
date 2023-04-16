import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Space,
  Switch,
  Tag,
  Typography
} from 'antd'
import { Fragment, useEffect } from 'react'

import QuillEditor from '@Components/QuillEditor'
import { Types } from '@adewaskar/lms-common'
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
}

function CourseAdvancedSettings(props: CourseAdvancedSettingsPropsI) {
  const { id } = useParams()
  const courseId = props.courseId || id
  const form = Form.useFormInstance()
  const sendEmail = useWatch(['advanced', 'email', 'enabled'], form)
  return (
    <Fragment>
      <Form.Item
        valuePropName="checked"
        name={['advanced', 'watermark', 'enabled']}
      >
        <Checkbox>Enable Water Mark</Checkbox>
      </Form.Item>

      <Title level={3}>Email Notification</Title>
      <Form.Item
        valuePropName="checked"
        name={['advanced', 'email', 'enabled']}
        label="Send email to learner on course enrollment."
      >
        <Switch />
      </Form.Item>
      {sendEmail ? (
        <Fragment>
          <Form.Item
            name={['advanced', 'email', 'subject']}
            label="Email Subject"
          >
            <Input />
          </Form.Item>

          <Form.Item name={['advanced', 'email', 'cc']} label="Add Cc">
            <Input />
          </Form.Item>
          <Form.Item
            name={['advanced', 'email', 'content']}
            required
            label="Email Body"
          >
            <QuillEditor variables={VARIABLES} name={['advanced', 'email', 'content']} />
          </Form.Item>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default CourseAdvancedSettings
