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
  Typography
} from 'antd'
import { Fragment, useEffect } from 'react'

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
}

function CourseCertificate(props: CourseCertificatePropsI) {
  const { id } = useParams()
  const courseId = props.courseId || id
  const form = Form.useFormInstance()
  const sendEmail = useWatch(['advanced', 'email', 'enabled'], form)
  return (
    <Fragment>
      <Card
        title="Certificate Template Design"
        extra={<a href="#">More</a>}
        style={{ width: '100%' }}
      >
        {/* <Sel> */}
      </Card>
    </Fragment>
  )
}

export default CourseCertificate
