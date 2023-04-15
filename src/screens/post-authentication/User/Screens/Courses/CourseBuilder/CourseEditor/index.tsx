import { Button, Card, Form, Tabs, message } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import { Course } from '@adewaskar/lms-common/lib/cjs/types/types/Courses.types'
import CourseAdvancedSettings from './CourseAdvancedSettings/CourseAdvancedSettings'
import CourseDetailsEditor from './CourseDetailsEditor'
import CourseLandingPageEditor from './CourseLandingPageEditor/CourseLandingPageEditor'
import CoursePricingEditor from './CoursePricingEditor/CoursePricingEditor'
import Header from '@Components/Header'
import { STRINGIFY } from '../utils'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function CourseEditor() {
  const message = useMessage()
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(Constants.INITIAL_COURSE_DETAILS)
  const {
    mutate: updateCourse,
    isLoading: loading
  } = User.Queries.useUpdateCourse()

  const { data: courseDetails } = User.Queries.useGetCourseDetails(
    courseId + '',
    {
      enabled: !!courseId
    }
  )

  useEffect(
    () => {
      setCourse(courseDetails)
    },
    [courseDetails]
  )

  const saveCourse = (e:Partial<Course>) => {
    updateCourse(
      {
        id: courseId + '',
        data: e
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved'
          })
        }
      }
    )
  }

  useEffect(() => {
    form.setFieldsValue(courseDetails);
  },[courseDetails])

  const onCourseUpdate = (data: Partial<Types.Course>) => {
    setCourse({
      ...course,
      ...data
    })
  }
  const [form] = Form.useForm<Types.Course>();

  return (
    <Header
      // hideBack
      title="Course Editor"
      extra={[
        <Fragment>
          <Button
            onClick={() => {
              // const dataStr = STRINGIFY(JSON.stringify(course))
              window.open(`${course._id}/preview`, '_blank')
            }}
            style={{ marginRight: 15 }}
            icon={<EyeOutlined />}
          >
            Preview
          </Button>,
          <Button
            loading={loading}
            type="primary"
            onClick={form.submit}
            icon={<UploadOutlined />}
          >
            Save Course
          </Button>
        </Fragment>
      ]}
    >
      <Card>
        <Form onFinish={saveCourse} form={form} layout="vertical" autoComplete="off">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `Details`,
              key: '1',
              children: (
                <CourseDetailsEditor
                />
              )
            },
            {
              label: `Pricing`,
              key: '2',
              children: (
                <CoursePricingEditor
                  courseId={course._id}
                />
              )
            },
            {
              label: `Landing Page`,
              key: '3',
              children: (
                <CourseLandingPageEditor
                  courseId={course._id}
                />
              )
            },
            {
              label: `Advanced`,
              key: '4',
              children: (
                <CourseAdvancedSettings
                  courseId={course._id}
                />
              )
            }
          ]}
          />
          </Form>

        <Outlet />
      </Card>
    </Header>
  )
}

export default CourseEditor
