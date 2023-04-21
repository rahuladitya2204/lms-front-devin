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
import { Fragment, useEffect, useLayoutEffect } from 'react'

import HtmlEditor from '@Components/HtmlEditor'
import QuillEditor from '@Components/QuillEditor'
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
    <Form
      onValuesChange={d => {
        const data = deepPatch(props.course.advanced, d)
        console.log(data, d, 1111)
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

      <Title level={3}>Email Notification</Title>
      <Form.Item
        valuePropName="checked"
        name={['email', 'enabled']}
        label="Send email to learner on course enrollment."
      >
        <Switch />
      </Form.Item>
      {sendEmail ? (
        <Fragment>
          <Form.Item name={['email', 'subject']} label="Email Subject">
            <Input />
          </Form.Item>

          <Form.Item name={['email', 'cc']} label="Add Cc">
            <Input />
          </Form.Item>
          <Form.Item name={['email', 'content']} required label="Email Body">
            <HtmlEditor
              defaultValue={props.course.advanced.email?.content}
              variables={VARIABLES}
              name={['email', 'content']}
            />
          </Form.Item>
        </Fragment>
      ) : null}
    </Form>
  )
}

export default CourseAdvancedSettings
