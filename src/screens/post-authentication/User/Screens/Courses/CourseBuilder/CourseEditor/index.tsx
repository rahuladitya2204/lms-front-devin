import { Button, Card, Form } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import { Course } from '@adewaskar/lms-common/lib/cjs/types/types/Courses.types'
import CourseAdvancedSettings from './CourseAdvancedSettings/CourseAdvancedSettings'
import CourseDetailsEditor from './CourseDetailsEditor'
import CourseLandingPageEditor from './CourseLandingPageEditor/CourseLandingPageEditor'
import CoursePricingEditor from './CoursePricingEditor/CoursePricingEditor'
import Header from '@Components/Header'
import Tabs from '@Components/Tabs'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function CourseEditor() {
  const message = useMessage()
  const { id } = useParams()
  const courseId = id + ''
  const [course, setCourse] = useState(Constants.INITIAL_COURSE_DETAILS)
  const {
    mutate: updateCourseApi,
    isLoading: loading
  } = User.Queries.useUpdateCourse()

  const { data: courseDetails } = User.Queries.useGetCourseDetails(courseId, {
    enabled: !!courseId
  })

  // const { } = User.Queries.useUpdateCourseStatus();

  useEffect(
    () => {
      setCourse(courseDetails)
    },
    [courseDetails]
  )

  const saveCourse = (e: Partial<Course>) => {
    setCourse({
      ...course,
      ...e
    })
  }
  const updateCourse = () => {
    updateCourseApi(
      {
        id: courseId,
        data: course
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

  const validatePublishCourse = () => {
    return (
      course.title &&
      course.subtitle &&
      course.description &&
      course.difficultyLevel &&
      course.language &&
      course.instructor &&
      course.category &&
      course.landingPage.promoVideo &&
      course.landingPage.description &&
      course.plan &&
      (course.keywords && course.keywords.length)
    )
  }

  const validateDraftCourse = () => {
    return course.title
  }

  return (
    <Header
      title="Course Editor"
      extra={[
        <Button
          disabled={!validatePublishCourse()}
          onClick={() => {
            // const dataStr = STRINGIFY(JSON.stringify(course))
            window.open(`${courseId}/preview`, '_blank')
          }}
          style={{ marginRight: 15 }}
          icon={<UploadOutlined />}
        >
          Publish Course
        </Button>,
        <Button
          disabled={!validateDraftCourse()}
          loading={loading}
          type="primary"
          onClick={updateCourse}
          icon={<SaveOutlined />}
        >
          Save as draft
        </Button>
      ]}
    >
      <Card>
        {/* <Form onFinish={saveCourse} form={form} layout="vertical" autoComplete="off"> */}
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `Details`,
              key: 'details',
              children: (
                <CourseDetailsEditor
                  saveCourse={saveCourse}
                  course={course}
                  courseId={courseId}
                />
              )
            },
            {
              label: `Landing Page`,
              key: 'landing-page',
              children: (
                <CourseLandingPageEditor
                  courseId={courseId}
                  course={course}
                  saveCourse={saveCourse}
                />
              )
            },
            {
              label: `Pricing`,
              key: 'pricing',
              children: (
                <CoursePricingEditor
                  courseId={courseId}
                  course={course}
                  saveCourse={saveCourse}
                />
              )
            },
            {
              label: `Advanced`,
              key: 'advanced',
              children: (
                <CourseAdvancedSettings
                  courseId={courseId}
                  course={course}
                  saveCourse={saveCourse}
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
