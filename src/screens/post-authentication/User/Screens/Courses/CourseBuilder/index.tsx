// @ts-nocheck

import { Button, Card, Col, Form, Row } from 'antd'
import { Constants, Types, User } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import CourseSectionsNavigator from './CourseSectionsNavigator'
import CreateHeading from './CreateNewItem/CreateHeading'
import Header from '@Components/Header'
import Image from '@Components/Image'
import ImageUpload from '@Components/ImageUpload'
import MediaUpload from '@Components/MediaUpload'
import { cloneDeep } from 'lodash'
import styled from '@emotion/styled'
import { updateCourseSectionItem } from './utils'
import useMessage from '@Hooks/useMessage'

const AddChapterButton = styled(Button)`
  margin-top: 20px;
`

function CourseBuilderScreen() {
  const message = useMessage()
  const { id: courseId } = useParams()
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

  const [course, setCourse] = useState(Constants.INITIAL_COURSE_DETAILS)
  const navigate = useNavigate()

  const onAddSection = ({ title }: Partial<Types.CourseSection>) => {
    let COURSE = cloneDeep(course)
    const newSection: Types.CourseSection = {
      title: title + '',
      items: [],
      description: ''
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
    item: Partial<Types.CourseSectionItem>,
    index: number
  ) => {
    // debugger;
    let COURSE = cloneDeep(course)
    const sectionId = COURSE.sections[index]._id
    const newItem: Partial<Types.CourseSectionItem> = {
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
        navigate(`section/${sectionId}/${type}/${item?._id}`)
      }
    })
  }

  // useEffect(
  //   () => {
  //     console.log('Oh yeah', course)
  //     if (course?.sections[0]?.items?.length) {
  //       const firstSection = course.sections[0]
  //       const firstItem = firstSection.items[0]
  //       navigate(
  //         `section/${firstSection._id}/${firstItem.type}/${firstItem._id}`
  //       )
  //     }
  //   },
  //   [course]
  // )

  const saveCourse = () => {
    updateCourse(
      {
        id: courseId + '',
        data: course
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved Course'
          })
        }
      }
    )
  }

  useEffect(
    () => {
      setCourse(courseDetails)
    },
    [courseDetails]
  )

  const updateCourseSection = (
    sectionId: string,
    item: Types.CourseSectionItem
  ) => {
    const COURSE = cloneDeep(course)
    COURSE.sections = updateCourseSectionItem(COURSE.sections, sectionId, item)
    setCourse(COURSE)
  }

  const deleteSection = (index: number) => {
    const COURSE = cloneDeep(course)
    COURSE.sections.splice(index, 1)
    updateCourse({
      id: courseId + '',
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
      id: courseId + '',
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
                <Form.Item>
                  <MediaUpload
                    uploadType="image"
                    prefixKey={`courses/${courseId}/thumbnailImage`}
                    cropper
                    width="100%"
                    height="200px"
                    renderItem={() => (
                      <Image preview={false} src={course.thumbnailImage} />
                    )}
                    name="thumbnailImage"
                  />
                </Form.Item>
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
