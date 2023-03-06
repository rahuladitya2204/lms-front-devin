// @ts-nocheck

import { Button, Card, Col, Row } from 'antd'
import { CourseSection, CourseSectionItem } from '@Types/Courses.types'
import { Outlet, useNavigate, useParams } from 'react-router'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useGetCourseDetails, useUpdateCourse } from '@User/Api/Course/queries'

import CourseSectionsNavigator from './CourseSectionsNavigator'
import CreateHeading from './CreateNewItem/CreateHeading'
import Header from '@Components/Header'
import { INITIAL_COURSE_DETAILS } from 'constant.ts'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { cloneDeep } from 'lodash'
import styled from '@emotion/styled'
import { updateCourseSectionItem } from './utils'

const AddChapterButton = styled(Button)`
  margin-top: 20px;
`

function CourseBuilderScreen() {
  const { id: courseId } = useParams()
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  const [course, setCourse] = useState<Course>(INITIAL_COURSE_DETAILS)
  const navigate = useNavigate()

  const onAddSection = ({ title }: Partial<CourseSection>) => {
    let COURSE = cloneDeep(course)
    const newSection: CourseSection = {
      title: title + '',
      items: [],
      description: ''
      // _id: ''
    }
    COURSE.sections.push(newSection)
    updateCourse({
      id: courseId || '',
      data: {
        sections: COURSE.sections
      }
    })
  }

  const onAddNewItem = (
    type: string,
    item: Partial<CourseSectionItem>,
    index: number
  ) => {
    let COURSE = cloneDeep(course)
    const sectionId = COURSE.sections[index]._id
    const newItem: CourseSectionItem = {
      title: item.title ? item.title : '',
      description: item.description ? item.description : '',
      // _id: '',
      // fix later
      type,
      metadata: item.metadata,
      section: sectionId
    }
    COURSE.sections[index].items.push(newItem)

    updateCourse({
      id: courseId || '',
      data: {
        sections: COURSE.sections
      },
      cb: course => {
        const item = [...course.sections[index].items].pop()
        navigate(`section/${sectionId}/${type}/${item._id}`)
      }
    })
  }

  useEffect(
    () => {
      if (course?.sections[0]?.items?.length) {
        const firstSection = course.sections[0]
        const firstItem = firstSection.items[0]
        navigate(
          `section/${firstSection._id}/${firstItem.type}/${firstItem._id}`
        )
      }
    },
    [courseId]
  )

  const saveCourse = () => {
    updateCourse({
      id: courseId + '',
      data: course
    })
  }

  useEffect(
    () => {
      setCourse(courseDetails)
    },
    [courseDetails]
  )

  const updateCourseSection = (sectionId: string, item: CourseSectionItem) => {
    const COURSE = cloneDeep(course)
    COURSE.sections = updateCourseSectionItem(COURSE.sections, sectionId, item)
    setCourse(COURSE)
  }

  const deleteSection = (index: number) => {
    const COURSE = cloneDeep(course)
    COURSE.sections.splice(index, 1)
    updateCourse({
      id: courseId,
      data: {
        sections: COURSE.sections
      },
      cb: course => {
        const lastSection = course.sections.pop()
        const lastItem = lastSection?.items.pop()
        if (lastSection && lastItem)
          navigate(
            `section/${lastSection._id}/${lastItem.type}/${lastItem._id}`
          )
      }
    })
  }

  const deleteSectionItem = (sectionIndex: number, itemIndex: number) => {
    const COURSE = cloneDeep(course)
    COURSE.sections[sectionIndex].items.splice(itemIndex, 1)
    updateCourse({
      id: courseId,
      data: {
        sections: COURSE.sections
      },
      cb: course => {
        const lastSection = course.sections.pop()
        const lastItem = lastSection?.items.pop()
        if (lastSection && lastItem)
          navigate(
            `section/${lastSection._id}/${lastItem.type}/${lastItem._id}`
          )
      }
    })
  }

  return (
    <Header
      title={'Course Builder'}
      hideBack
      extra={[
        <Button style={{ marginRight: 15 }} icon={<UploadOutlined />}>
          Publish Course
        </Button>,
        <Button
          onClick={() => saveCourse()}
          loading={loading}
          type="primary"
          icon={<SaveOutlined />}
        >
          Save
        </Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card style={{ marginBottom: 30 }}>
            <Row>
              <Col span={24}>
                <MediaUpload
                  width="100%"
                  height="200px"
                  renderItem={() => <Image preview={false} src={course.thumbnailImage} />}
                  onUpload={e =>
                    setCourse({
                      ...course,
                      thumbnailImage: e.url
                    })
                  }
                />
              </Col>
              <Col span={24} style={{ marginTop: 30 }}>
                {course.sections.length ? (
                  <CourseSectionsNavigator
                    deleteSectionItem={deleteSectionItem}
                    deleteSection={deleteSection}
                    onAddNewItem={onAddNewItem}
                    sections={course.sections}
                  />
                ) : null}
              </Col>
            </Row>

            <CreateHeading onFinish={e => onAddSection(e)}>
              <AddChapterButton block type="primary">
                Add New Section
              </AddChapterButton>
            </CreateHeading>
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <Outlet context={[course.sections, updateCourseSection]} />
          </Card>
        </Col>
      </Row>
    </Header>
  )
}

export default CourseBuilderScreen
