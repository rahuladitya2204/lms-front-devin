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
import { Fragment, useLayoutEffect } from 'react'
import { convertToCommaSeparated, deepPatch } from '../../CourseBuilder/utils'

import CourseCertificate from './CourseCertificate/CourseCertificateScreen'
import GenerateWithAI from '../GenerateWithAiButton'
import InputTags from '@Components/InputTags/InputTags'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import { Types } from '@adewaskar/lms-common'

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

  const onValuesChange=(d:any) => {
    const data = deepPatch(props.course.advanced, d)
    props.saveCourse({
      advanced: data
    })
  }
  const keywords = props.course.keywords;
  return (
    <>
     <Form
      onValuesChange={onValuesChange}
      form={form}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item valuePropName="checked" name={['watermark', 'enabled']}>
        <Checkbox>Enable Water Mark</Checkbox>
        </Form.Item>
        
        <Form.Item label='Course Keywords' name={['keywords']} extra={  <GenerateWithAI
        courseId={props.course._id}
        fields={['keywords']}
          onValuesChange={(e: any) => {
            if (e && e.keywords) {
              const keywords = convertToCommaSeparated(e?.keywords?.toLowerCase());
              props.saveCourse({
                keywords
              });
            }            
        }}
      />}>
          <InputTags values={keywords} onChange={(e: any) => {
              props.saveCourse({
                keywords: e
              });
          }
        } />
      </Form.Item>

        {/* <Card bodyStyle={{
          display:sendEmail?'block':'none'
        }} title={<Title level={3}>Email Notification</Title>} extra={
              <Tooltip placement="topLeft" title={`Send email to learner on course enrollment`}>

          <Form.Item style={{margin:0}}
        valuePropName="checked"
        name={['email', 'enabled']}
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
</Card> */}
      </Form>
      <Divider/>
      <CourseCertificate   courseId={props.courseId}
                  course={props.course}
                  saveCourse={props.saveCourse}/>
    </>
  )
}

export default CourseAdvancedSettings
