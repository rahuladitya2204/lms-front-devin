import { Alert, Button, Card, Col, Form, Modal, Row, Spin } from 'antd'
import { Constants, Types, User, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { parseAIJson, updateCourseSectionItem } from './utils'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import BackButton from '@Components/BackButton'
import CourseSectionsNavigator from './CourseSectionsNavigator'
import GenerateWithAI from '../CourseInformation/GenerateWithAiButton'
import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import SetCourseRules from './SetRules'
import { cloneDeep } from 'lodash'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal

function CourseBuilderScreen() {
  const message = useMessage()
  const { id: courseId, itemId } = useParams()
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
  const {
    mutate: deleteSectionApi,
    isLoading: deletingSection
  } = User.Queries.useDeleteCourseSection()
  const {
    mutate: deleteSectionItemApi,
    isLoading: deletingSectionItem
  } = User.Queries.useDeleteCourseSectionItem()
  const [course, setCourse] = useState(Constants.INITIAL_COURSE_DETAILS)
  const navigate = useNavigate()

  const onAddSection = (section: Partial<Types.CourseSection>) => {
    console.log(section, 'section')
    let COURSE = cloneDeep(course)
    if (section._id) {
      COURSE.sections.forEach((sec, index) => {
        if (sec._id === section._id) {
          COURSE.sections[index] = { ...sec, ...section }
        }
      })
    } else {
      // @ts-ignore
      const newSection: Types.CourseSection = {
        title: section.title + '',
        items: [],
        description: ''
      }
      COURSE.sections.push(newSection)
    }

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
    if (item._id) {
      COURSE.sections[index].items.forEach((i, itemIndex) => {
        if (i._id === item._id) {
          // @ts-ignore
          COURSE.sections[index].items[itemIndex] = {
            ...item,
            ...newItem,
            type
          }
        }
      })
    } else {
      // @ts-ignore
      COURSE.sections[index].items.push(newItem)
    }
    updateCourse({
      id: courseId || '',
      data: {
        sections: COURSE.sections
      },
      cb: course => {
        if (item._id) {
          return navigate(`${type}/${item._id}`)
        }
        const newlyAdedItem = [...course.sections[index].items].pop()
        navigate(`${type}/${newlyAdedItem?._id}`)
      }
    })
  }

  const saveCourse = (d: Partial<Types.Course>) => {
    if (course._id) {
      updateCourse(
        {
          id: courseId + '',
          data: { ...course, ...d }
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
  }

  useEffect(
    () => {
      if (!itemId) {
        const firstSection = course.sections.find(s => s.items.length)
        if (firstSection && firstSection.items.length) {
          const firstItem = firstSection.items[0]
          if (firstItem.type) {
            navigate(`${firstItem.type}/${firstItem._id}`)
          }
        }
      }
    },
    [course._id]
  )

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
    // saveCourse(COURSE)
  }

  const deleteSection = (sectionId: string) => {
    deleteSectionApi(
      {
        data: {
          courseId: courseId + '',
          sectionId: sectionId
        }
      },
      {
        onSuccess: () => {
          const lastSection = course.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem && lastItem.type)
            navigate(`${lastItem.type}/${lastItem._id}`)
        }
      }
    )
  }

  const deleteSectionItem = (sectionId: string, itemId: string) => {
    const COURSE = cloneDeep(course)
    // COURSE.sections[sectionIndex].items.splice(itemIndex, 1)
    deleteSectionItemApi(
      {
        data: {
          courseId: courseId + '',
          sectionId: sectionId,
          itemId: itemId
        }
      },
      {
        onSuccess: () => {
          const lastSection = course.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem && lastItem.type)
            navigate(`${lastItem.type}/${lastItem._id}`)
        }
      }
    )
  }

  const onReorderSections = (sections: Types.CourseSection[]) => {
    const COURSE = cloneDeep(course)
    COURSE.sections = sections
    setCourse(COURSE)
    saveCourse(COURSE)
  }
  // const { mutate: updateCourseStatus } = User.Queries.useUpdateCourseStatus(
  //   courseId + ''
  // )
  const items = course.sections.map(s => s.items).flat()
  const { mutate: publishCourse } = User.Queries.usePublishCourse()
  return (
    <Header
      title={
        <span>
          {' '}
          <BackButton
            onClick={() => navigate('../app/products/courses')}
          />{' '}
          {course.title}
        </span>
      }
      extra={[
        <Button
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
          disabled={!Utils.validatePublishCourse(course)}
          style={{ marginRight: 15 }}
          icon={<UploadOutlined />}
        >
          Publish Course
        </Button>,
        <Button
          onClick={() => saveCourse(course)}
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
          <Row>
            <Col span={24}>
              <Form.Item>
                <MediaUpload
                  source={{
                    type: 'course.thumbnailImage',
                    value: courseId + ''
                  }}
                  uploadType="image"
                  prefixKey={`courses/${courseId}/thumbnailImage`}
                  cropper
                  width="100%"
                  // height="200px"
                  aspect={16 / 9}
                  renderItem={() => (
                    <Image preview={false} src={course.thumbnailImage} />
                  )}
                  onUpload={file => {
                    saveCourse({
                      thumbnailImage: file.url
                    })
                  }}
                />
                <Row
                  justify={'space-between'}
                  style={{ margin: '20px 0 0', marginTop: 20 }}
                  gutter={[20, 20]}
                >
                  <Col flex={1}>
                    <Button block>Preview</Button>
                  </Col>
                  <Col flex={1}>
                    <ActionModal
                      title="Set Rules"
                      cta={
                        <Button block type="primary">
                          Set Rules
                        </Button>
                      }
                    >
                      <SetCourseRules
                        onSubmit={d =>
                          saveCourse({
                            rules: d
                          })
                        }
                        data={course.rules}
                      />
                    </ActionModal>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Spin spinning={deletingSection || deletingSectionItem}>
                <CourseSectionsNavigator
                  deleteSectionItem={deleteSectionItem}
                  deleteSection={deleteSection}
                  onAddNewItem={onAddNewItem}
                  onAddSection={onAddSection}
                  sections={course.sections}
                  onReorderSections={onReorderSections}
                />
              </Spin>
            </Col>
          </Row>
        </Col>
        <Col span={16}>
          {!course.sections.length ? (
            <Alert
              message="Generate course structure using AI"
              description="You can generate course outline using our AI"
              type="info"
              showIcon
              action={
                <GenerateWithAI
                  courseId={course._id}
                  fields={['sections']}
                  onValuesChange={({ sections }: any) => {
                    console.log(sections, 'parseAIJson')
                    updateCourse(
                      {
                        id: courseId || '',
                        data: {
                          // @ts-ignore
                          sections: parseAIJson(sections).sections
                        }
                      },
                      {
                        onSuccess: () => {
                          navigate('')
                        }
                      }
                    )
                  }}
                />
              }
            />
          ) : (
            <Card>
              <Outlet context={[items, updateCourseSection, saveCourse]} />
            </Card>
          )}
        </Col>
      </Row>
    </Header>
  )
}

export default CourseBuilderScreen
