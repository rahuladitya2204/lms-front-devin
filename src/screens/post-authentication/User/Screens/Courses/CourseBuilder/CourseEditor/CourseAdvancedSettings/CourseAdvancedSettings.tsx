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

const { Title } = Typography
const { useWatch } = Form

const VARIABLES = [
  {
    label: 'Course Title',
    value: 'course.title'
  },
  {
    label: 'Course Instructor',
    value: 'course.instructor.name'
  },
  {
    label: 'Learner Name',
    value: 'title'
  },
  {
    label: 'Course Release Date',
    value: 'course.enrolledAt'
  }
]

interface CourseAdvancedSettingsPropsI {
  courseId: string;
}

function CourseAdvancedSettings(props: CourseAdvancedSettingsPropsI) {
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
        name={['advanced', 'email', 'enabled']}
        label="Send email to learner on course enrollment."
      >
        <Switch defaultChecked />
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
            <Space direction="vertical" style={{ marginBottom: 30 }}>
              <Space size={[0, 8]} wrap>
                {VARIABLES.map(variable => (
                  <Tag color="default">{variable.label}</Tag>
                ))}
              </Space>
            </Space>
            <QuillEditor />
          </Form.Item>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default CourseAdvancedSettings
