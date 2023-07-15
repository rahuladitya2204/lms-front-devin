import { Button, Card, Col, Form, Row } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import {
  EyeOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import BackButton from '@Components/BackButton'
import { Course } from '@adewaskar/lms-common/lib/cjs/types/types/Courses.types'
import CourseInformationEditor from './CourseInformation'
import CourseLearners from './CourseLearners/CourseLearners'
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
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Card
          title={
            <span>

              <BackButton /> {course.title}
            </span>
          }
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
          <Tabs
            tabPosition={'left'}
            style={{ minHeight: '100vh' }}
            items={[
              {
                label: (
                  <span>
                    <InfoCircleOutlined />Information
                  </span>
                ),
                key: 'information',
                children: <CourseInformationEditor />
              },
              {
                label: (
                  <span>
                    <UserOutlined />Learners
                  </span>
                ),
                key: 'learners',
                children: <CourseLearners courseId={course._id} />
              }
            ]}
          />
        </Card>
      </Col>
      {/* <Col span={20}>
          <CourseInformationEditor />
        </Col> */}
    </Row>
  )
}

export default CourseEditor
