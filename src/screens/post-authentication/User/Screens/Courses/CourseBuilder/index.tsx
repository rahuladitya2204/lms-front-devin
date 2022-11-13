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
  useGetCourseDetails,
  useUpdateCourse
} from '@User/Api/queries'
import MediaUpload from '@Components/MediaUpload'
import { INITIAL_COURSE_DETAILS } from 'constant'

const AddChapterButton = styled(Button)`
  margin-top: 20px;
`

function CourseBuilderScreen() {
  const { id: courseId } = useParams()
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  const [course, setCourse] = useState <Course>(INITIAL_COURSE_DETAILS)
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
    index: number
  ) => {
    let COURSE = cloneDeep(course)
    const ID = uuid()
    const newItem: CourseSectionItem = {
      title: item.title ? item.title : '',
      description: item.description ? item.description : '',
      id: ID,
      type,
      metadata: item.metadata
    }
    COURSE.sections[index].items.push(newItem)

    navigate(`section/${COURSE.sections[index].id}/${type}/${ID}`)
    setCourse(COURSE)
  }

  useEffect(() => {
    if (course?.sections[0]?.items?.length)
    {
      const firstSection = course.sections[0];
      const firstItem = firstSection.items[0];
      navigate(`section/${firstSection.id}/${firstItem.type}/${firstItem.id}`)
  
    }
  }, [course._id])

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
        <Col span={8}>
          <Card style={{ marginBottom: 30 }}>
            <Row>
              <Col span={24}>
                <MediaUpload
                  renderItem={() => <Image src={course.thumbnailImage} />}
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
