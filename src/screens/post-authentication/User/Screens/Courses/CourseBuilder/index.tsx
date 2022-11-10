import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Col, Image, Row } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import CourseSectionsNavigator from './CourseSectionsNavigator'
import CreateHeading from './CreateNewItem/CreateHeading'
import styled from '@emotion/styled'
import { updateCourseSectionItem } from './utils'
import { v4 as uuid } from 'uuid'
import Header from '../../Header/Header'

import { cloneDeep } from 'lodash'
import { Course, CourseSection, CourseSectionItem } from '@Types/Courses.types'
import {
  INITIAL_COURSE_DETAILS,
  useGetCourseDetails,
  useUpdateCourse
} from '@User/Api/queries'
import MediaUpload from '@Components/MediaUpload'

const AddChapterButton = styled(Button)`
  margin-top: 20px;
`

function CourseBuilderScreen() {
  const { id: courseId } = useParams()
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  const [course, setCourse] = useState < Course > INITIAL_COURSE_DETAILS
  const navigate = useNavigate()

  const onAddSection = ({ title }: Partial<CourseSection>) => {
    let COURSE = cloneDeep(course)
    const ID = uuid()
    const newSection: CourseSection = {
      title: title + '',
      items: [],
      description: '',
      id: ID
    }
    COURSE.sections.push(newSection)
    setCourse(COURSE)
  }

  const onAddNewItem = (
    type: string,
    item: Partial<CourseSectionItem>,
    metadata: unknown,
    index: number
  ) => {
    let COURSE = cloneDeep(course)
    const ID = uuid()
    const newItem: CourseSectionItem = {
      title: item.title + '',
      description: item.title + '',
      id: ID,
      type,
      ...item
    }
    COURSE.sections[index].items.push({ item: newItem, metadata: metadata })

    navigate(`section/${COURSE.sections[index].id}/${type}/${ID}`)
    setCourse(COURSE)
  }

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
    setCourse(COURSE)
  }

  const deleteSectionItem = (sectionIndex: number, itemIndex: number) => {
    const COURSE = cloneDeep(course)
    COURSE.sections[sectionIndex].items.splice(itemIndex, 1)
    setCourse(COURSE)
  }

  return (
    <Header
      title={'Course Builder'}
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
        <Col span={9}>
          <Card style={{ marginBottom: 30 }}>
            <Row>
              <Col span={24}>
                <MediaUpload
                  renderItem={() => <Image src={course.thumbnailImage} />}
                  onUpload={e =>
                    setCourse({
                      ...course,
                      thumbnailImage: e[0].url
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
        <Col span={15}>
          <Card>
            <Outlet context={[course.sections, updateCourseSection]} />
          </Card>
        </Col>
      </Row>
    </Header>
  )
}

export default CourseBuilderScreen
