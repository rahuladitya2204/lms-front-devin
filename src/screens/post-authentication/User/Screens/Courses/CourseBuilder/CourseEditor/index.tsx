import { Button, Card, Col, Form, Modal, Row, Spin } from 'antd'
import {
  ClockCircleOutlined,
  EyeOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  ToolOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Constants, Types, Utils } from '@adewaskar/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

import BackButton from '@Components/BackButton'
import { Course } from '@adewaskar/lms-common/lib/cjs/types/types/Courses.types'
import CourseCertificate from './CourseInformation/CourseAdvancedSettings/CourseCertificate/CourseCertificateScreen'
import CourseInformationEditor from './CourseInformation'
import CourseLearners from './CourseLearners/CourseLearners'
import Tabs from '@Components/Tabs'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal

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

  const {
    mutate: publishCourse,
    isLoading: publishingCourse
  } = User.Queries.usePublishCourse()

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

  const validateDraftCourse = () => {
    return course.title
  }
  const navigate = useNavigate()
  return (
    <Spin spinning={publishingCourse}>
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
                disabled={!Utils.validatePublishCourse(course)}
                onClick={() => {
                  confirm({
                    title: 'Are you sure?',
                    content: `You want to publish this course?`,
                    onOk() {
                      publishCourse({
                        courseId: course._id
                      })
                    },
                    okText: 'Yes, Publish'
                  })
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
              onTabClick={e => {
                if (e === 'builder') {
                  navigate(`../app/products/courses/${course._id}/builder`)
                }
              }}
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
                  children: (
                    <CourseInformationEditor
                      saveCourse={saveCourse}
                      course={course}
                      courseId={courseId}
                    />
                  )
                },
                {
                  label: (
                    <span>
                      <ToolOutlined />Builder
                    </span>
                  ),
                  key: 'builder'
                },
                {
                  label: (
                    <span>
                      <ClockCircleOutlined />Drip
                    </span>
                  ),
                  key: 'drip',
                  children: <CourseLearners courseId={course._id} />
                },
                {
                  label: (
                    <span>
                      <UserOutlined />Learners
                    </span>
                  ),
                  key: 'learners',
                  children: <CourseLearners courseId={course._id} />
                },
                {
                  label: (
                    <span>
                      <SafetyCertificateOutlined />Certificate
                    </span>
                  ),
                  key: 'certificate',
                  children: (
                    <CourseCertificate
                      courseId={course._id}
                      course={course}
                      saveCourse={saveCourse}
                    />
                  )
                }
              ]}
            />
          </Card>
        </Col>
        {/* <Col span={20}>
          <CourseInformationEditor />
        </Col> */}
      </Row>
    </Spin>
  )
}

export default CourseEditor
