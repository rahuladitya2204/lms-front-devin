import { Button, Card, Tabs } from 'antd'
import { EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { useGetCourseDetails, useUpdateCourse } from '@User/Api/Course/queries'

import { Course } from '@Types/Courses.types'
import CourseAdvancedSettings from './CourseAdvancedSettings/CourseAdvancedSettings'
import CourseDetailsEditor from './CourseDetailsEditor'
import CourseLandingPageEditor from './CourseLandingPageEditor/CourseLandingPageEditor'
import CoursePricingEditor from './CoursePricingEditor/CoursePricingEditor'
import Header from '@Components/Header'
import { INITIAL_COURSE_DETAILS } from 'constant.ts'
import { STRINGIFY } from '../utils'

function CourseEditor() {
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(INITIAL_COURSE_DETAILS)
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()

  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  useEffect(
    () => {
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
    console.log(data,'da')
    setCourse({
      ...course,
      ...data
    });
  }

  return (
    <Header
      // hideBack
      title="Course Editor"
      extra={[
        <Fragment>
          <Button
            onClick={() => {
              const dataStr = STRINGIFY(JSON.stringify(course))
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
                  courseId={course._id}
                  formData={course}
                  onFormUpdate={onCourseUpdate}
                />
              )
            },
            {
              label: `Landing Page`,
              key: '3',
              children: (
                <CourseLandingPageEditor
                  formData={course.landingPage}
                  courseId={course._id}
                  onFormUpdate={e =>
                    onCourseUpdate({
                      ...course,
                      landingPage: e
                    })
                  }
                />
              )
            },
            {
              label: `Advanced`,
              key: '4',
              children: (
                <CourseAdvancedSettings
                  courseId={course._id}
                  formData={course.advanced}
                  onFormUpdate={e => {
                    console.log(e, 'eee')
                    onCourseUpdate({
                      // ...course,
                      advanced: e
                    })
                  }}
                />
              )
            }
          ]}
        />

        <Outlet />
      </Card>
    </Header>
  )
}

export default CourseEditor
