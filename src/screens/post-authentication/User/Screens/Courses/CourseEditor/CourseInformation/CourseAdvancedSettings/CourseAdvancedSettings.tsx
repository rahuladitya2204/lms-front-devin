import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Switch,
  Tag,
  Tooltip,
} from 'antd'
import { Fragment, useLayoutEffect } from 'react'
import { convertToCommaSeparated, deepPatch } from '../../CourseBuilder/utils'

import CourseCertificate from './CourseCertificate/CourseCertificateScreen'
import GenerateWithAI from '../GenerateWithAiButton'
import InputTags from '@Components/InputTags/InputTags'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'

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

const { Paragraph } = Typography;
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
        
        {/* <Form.Item label='Course Keywords' name={['keywords']} extra={  <GenerateWithAI
        courseId={props.course._id}
        fields={['keywords']}
          onValuesChange={(e: any) => {
            console.log(e,'eeeee')
            if (e && e.keywords) {
              const keywords = convertToCommaSeparated(e?.keywords?.toLowerCase());
              props.saveCourse({
                keywords
              });
            }            
        }}
      />}>
          <InputTags onChange={keywords => {
            // console.log(keywords,'kkj')
            props.saveCourse({
              keywords
            })
          }} name='keywords'/>
        </Form.Item> */}
        
        <Card bordered={false} bodyStyle={{
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
            <TextArea html
              variables={VARIABLES} height={300}
              name={['email', 'content']}
            />
          </Form.Item>
            </Fragment>
      ) : null}
        </Card>
        <Divider/>
        <Form.Item  style={{marginTop:20}}>
          <Row>
          <Col style={{width: 200}}>
              <Button type='primary' danger>Delete Course</Button>
            </Col>
            <Col flex={1}>      
          <Paragraph style={{marginTop:20}}>This will permanently delete your course. Though Learners who have purchased it will continue to have access till their subscription ends.
              </Paragraph>
            </Col>
         
          </Row>
        </Form.Item>
      </Form>
    </>
  )
}

export default CourseAdvancedSettings
