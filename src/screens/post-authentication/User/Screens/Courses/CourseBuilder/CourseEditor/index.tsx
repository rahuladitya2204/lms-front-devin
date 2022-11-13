import { Button, Card, Tabs } from 'antd'
import { EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { Outlet, useParams } from 'react-router'
import { Fragment, useEffect, useState } from 'react'

import CourseDetailsEditor from './CourseDetailsEditor'
import Header from '@Components/Header'
import {
  useGetCourseDetails,
  useUpdateCourse
} from '@User/Api/queries'
import { Course } from '@Types/Courses.types'
import { STRINGIFY } from '../utils'
import CoursePricingEditor from './CoursePricingEditor/CoursePricingEditor'
import { INITIAL_COURSE_DETAILS } from 'constant'

function CourseEditor() {
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(INITIAL_COURSE_DETAILS)
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()

  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  useEffect(
    () => {
      console.log(courseDetails,'aaa')
      setCourse(courseDetails)
    },
    [courseDetails]
  )

  const saveCourse = () => {
    updateCourse({
      id: courseId + '',
      data: course
    })
  }

  const onCourseUpdate = (data: Partial<Course>) => {
    setCourse({
      ...course,
      ...data
    })
  }

  return (
    <Header
      title="Course Editor"
      extra={[
        <Fragment>
          <Button
            onClick={() => {
              console.log(course, 'strf')
              const dataStr = STRINGIFY(JSON.stringify(course))
              window.open(`/courses/preview?details=${dataStr}`, '_blank')
            }}
            style={{ marginRight: 15 }}
            icon={<EyeOutlined />}
          >
            Preview
          </Button>,
          <Button
            loading={loading}
            type="primary"
            onClick={saveCourse}
            icon={<UploadOutlined />}
          >
            Save Course
          </Button>
        </Fragment>
      ]}
    >
      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `Details`,
              key: '1',
              children: (
                <CourseDetailsEditor
                  formData={course}
                  onFormUpdate={onCourseUpdate}
                />
              )
            },
            {
              label: `Pricing`,
              key: '2',
              children: (
                <CoursePricingEditor
                  formData={course}
                  onFormUpdate={onCourseUpdate}
                  course={course}
                />
              )
            },
            {
              label: `Pages`,
              key: '3',
              children: `Content of Tab Pane 3`
            },
            {
              label: `Advanced`,
              key: '4',
              children: `Content of Tab Pane 3`
            }
          ]}
        />

        <Outlet />
      </Card>
    </Header>
  )
}

export default CourseEditor
