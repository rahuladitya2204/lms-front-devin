import { Button, Card, Col, Form, Row } from 'antd'
import { Constants, Types } from '@invinciblezealorg/lms-common'
import { EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import { Course } from '@invinciblezealorg/lms-common/lib/cjs/types/types/Courses.types'
import CourseAdvancedSettings from './CourseAdvancedSettings/CourseAdvancedSettings'
import CourseDetailsEditor from './CourseDetailsEditor/CourseDetails'
import CourseLandingPageEditor from './CourseLandingPage/CourseLandingPageEditor'
import CoursePricingEditor from './CoursePricingEditor/CoursePricingEditor'
import Header from '@Components/Header'
import Tabs from '@Components/Tabs'
import { User } from '@invinciblezealorg/lms-common'
import useMessage from '@Hooks/useMessage'

function CourseInformationEditor(props: any) {
  const { id } = useParams()
  const courseId = id + ''
  const [course, setCourse] = useState(Constants.INITIAL_COURSE_DETAILS)

  const { data: courseDetails } = User.Queries.useGetCourseDetails(courseId, {
    enabled: !!courseId
  })

  useEffect(
    () => {
      setCourse(courseDetails)
    },
    [courseDetails]
  )
  return (
    <Fragment>
      {/* <Form onFinish={saveCourse} form={form} layout="vertical" autoComplete="off"> */}
      <Tabs
        // defaultActiveKey="1"
        items={[
          {
            label: `Details`,
            active: true,
            key: 'details',
            children: (
              <CourseDetailsEditor
                saveCourse={props.saveCourse}
                course={props.course}
                courseId={props.courseId}
              />
            )
          },
          {
            label: `Landing Page`,
            key: 'landing-page',
            children: (
              <CourseLandingPageEditor
                saveCourse={props.saveCourse}
                course={props.course}
                courseId={props.courseId}
              />
            )
          },
          {
            label: `Pricing`,
            key: 'pricing',
            children: (
              <CoursePricingEditor
                saveCourse={props.saveCourse}
                course={props.course}
                courseId={props.courseId}
              />
            )
          },
          {
            label: `Advanced`,
            key: 'advanced',
            children: (
              <CourseAdvancedSettings
                saveCourse={props.saveCourse}
                course={props.course}
                courseId={props.courseId}
              />
            )
          }
        ]}
      />

      <Outlet />
    </Fragment>
  )
}

export default CourseInformationEditor
