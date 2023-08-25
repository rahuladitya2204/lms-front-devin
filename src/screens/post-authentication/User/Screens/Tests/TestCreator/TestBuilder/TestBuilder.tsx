import { Alert, Button, Col, Form, Modal, Row, Spin, Tag } from 'antd'
import { Constants, Enum, Types, User, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { cloneDeep, debounce } from 'lodash'
import { useEffect, useState } from 'react'

import AITestPaperBuilder from './AITestBuilder/AITestBuilder'
import ActionModal from '@Components/ActionModal'
import AppProvider from 'screens/AppProvider'
import BackButton from '@Components/BackButton'
import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import TestSectionsNavigator from './TestSectionsNavigator'
import { updateTestSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal

function TestBuilderScreen() {
  const message = useMessage()
  const { id: testId, itemId } = useParams()
  const {
    mutate: updateTestApi,
    isLoading: savingTest
  } = User.Queries.useUpdateTest()
  const updateTest = debounce(updateTestApi, 1000);
  const { data: testDetails } = User.Queries.useGetTestDetails(testId + '', {
    enabled: !!testId
  })
  const {
    mutate: deleteSectionApi,
    isLoading: deletingSection
  } = User.Queries.useDeleteTestSection()
  const {
    mutate: deleteSectionItemApi,
    isLoading: deletingSectionItem
  } = User.Queries.useDeleteTestSectionItem()
  const [test, setTest] =
        useState<Types.Test>(Constants.INITIAL_LIVE_TEST_DETAILS)
  const navigate = useNavigate()

  const onAddSection = (section: Partial<Types.TestSection>) => {
    // console.log(section, 'section')
    let LIVE_TEST = cloneDeep(test)
    if (section._id) {
      LIVE_TEST.sections.forEach((sec, index) => {
        if (sec._id === section._id) {
          LIVE_TEST.sections[index] = { ...sec, ...section }
        }
      })
    } else {
      // @ts-ignore
      const newSection: Types.TestSection = {
        title: section.title + '',
        items: [{
          ...Constants.INITIAL_LIVE_TEST_QUESTION,
          title: 'New Question',
          _id: undefined
        }]
      }
      LIVE_TEST.sections.push(newSection)
    }

    updateTest(
      {
        id: testId || '',
        data: {
          sections: LIVE_TEST.sections
        }
      },
      {
        onSuccess: test => {
          // if (item._id) {
          //   return navigate(`${item._id}`)
          // }
          const newlyAdedItem = test.sections.pop().items.pop()
          console.log(test.sections, 'newlyAdedItem')
          navigate(
            `../app/products/test/${LIVE_TEST._id}/builder/${
              newlyAdedItem?._id
            }`
          )
        }
      }
    )
  }

  const onAddNewItem = (item: Partial<Types.TestQuestion>, index: number) => {
    // debugger;
    let LIVE_TEST = cloneDeep(test)
    const newItem: Partial<Types.TestQuestion> = {
      ...item
    }
    // console.log(test, 'livviviv')

    if (item._id) {
      LIVE_TEST.sections[index].items.forEach(
        (i: Types.TestQuestion, itemIndex: number) => {
          if (i._id === item._id) {
            // @ts-ignore
            LIVE_TEST.sections[index].items[itemIndex] = {
              ...item,
              ...newItem
            }
          }
        }
      )
    } else {
      // @ts-ignore
      LIVE_TEST.sections[index].items.push(newItem)
    }
    updateTest(
      {
        id: testId || '',
        data: {
          sections: LIVE_TEST.sections
        }
      },
      {
        onSuccess: test => {
          // if (item._id) {
          //   return navigate(`${item._id}`)
          // }
          const newlyAdedItem = [...test.sections[index].items].pop()
          // console.log(test.sections, 'newlyAdedItem')
          navigate(
            `../app/products/test/${LIVE_TEST._id}/builder/${
              newlyAdedItem?._id
            }`
          )
        }
      }
    )
  }

  const saveTest = (d: Partial<Types.Test>) => {
    const Data = { ...test, ...d }
    if (test._id) {
      updateTest(
        {
          id: testId + '',
          data: Data
        },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'Saved Test'
            })
          }
        }
      )
    }
  }
  useEffect(
    () => {
      if (!itemId) {
        const firstSection = test.sections.find(s => s.items.length)
        if (firstSection && firstSection.items.length) {
          const firstItem = firstSection.items[0]
          if (firstItem.type) {
            navigate(`${firstItem._id}`)
          }
        }
      }
    },
    [test._id]
  )

  useEffect(
    () => {
      setTest(testDetails)
    },
    [testDetails]
  )

  const updateTestSection = (
    itemId: string,
    item: Types.TestQuestion
  ) => {

    item._id = itemId
    const LIVE_TEST = cloneDeep(test)
    LIVE_TEST.sections = updateTestSectionItem(LIVE_TEST.sections, item)

    saveTest({
      sections: LIVE_TEST.sections
    })
  }

  const deleteSection = (sectionId: string) => {
    deleteSectionApi(
      {
        data: {
          testId: testId + '',
          sectionId: sectionId
        }
      },
      {
        onSuccess: () => {
          const lastSection = test.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem) navigate(`${lastItem._id}`)
        }
      }
    )
  }

  const deleteSectionItem = (sectionId: string, itemId: string) => {
    const LIVE_TEST = cloneDeep(test)
    deleteSectionItemApi(
      {
        data: {
          testId: testId + '',
          sectionId: sectionId,
          itemId: itemId
        }
      },
      {
        onSuccess: () => {
          const lastSection = test.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem) navigate(`${lastItem._id}`)
        }
      }
    )
  }

  const onReorderSections = (sections: Types.TestSection[]) => {
    const LIVE_TEST = cloneDeep(test)
    LIVE_TEST.sections = sections
    setTest(LIVE_TEST)
    saveTest(LIVE_TEST)
  }
  // const { mutate: updateTestStatus } = User.Queries.useUpdateTestStatus(
  //   testId + ''
  // )
  const { mutate: publishTest } = User.Queries.usePublishTest()
  return (
    <AppProvider>
      <Header
        title={
          <span>
            {' '}
            <BackButton onClick={() => navigate('../app/products/test')} />{' '}
            {test.title}
          </span>
        }
        extra={[
          <Spin spinning={savingTest}><Tag>Changes will be automatically saved</Tag></Spin>,
          // @ts-ignore
          test.status === Enum.CourseStatus.PUBLISHED ? (
            <Tag color="green">Test is Published</Tag>
          ) : (
            // <Button
            //   onClick={() => {
            //     confirm({
            //       title: 'Are you sure?',
            //       content: `You want to publish this Test?`,
            //       onOk() {
            //         // publishTest({
            //         //   testId: test._id
            //         // })
            //       },
            //       okText: 'Yes, Publish'
            //     })
            //   }}
            //   disabled={!Utils.validatePublishTest(test)}
            //   style={{ marginRight: 15 }}
            //   icon={<UploadOutlined />}
            // >
            //   Publish
            // </Button>
              null
          ),
          // <Button
          //   onClick={() => saveTest(test)}
          //   loading={loading}
          //   type="primary"
          //   icon={<SaveOutlined />}
          // >
          //   Save
          // </Button>
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <MediaUpload
                    source={{
                      type: 'test.thumbnailImage',
                      value: testId + ''
                    }}
                    uploadType="image"
                    prefixKey={`Tests/${testId}/thumbnailImage`}
                    cropper
                    width="100%"
                    // height="200px"
                    aspect={16 / 9}
                    renderItem={() => (
                      <Image preview={false} src={test.image} />
                    )}
                    onUpload={file => {
                      saveTest({
                        image: file.url
                      })
                    }}
                  />
                  <Row
                    justify={'space-between'}
                    style={{ margin: '20px 0 0', marginTop: 20 }}
                    gutter={[20, 20]}
                  >
                    <Col flex={1}>
                      <Button block>Set Rules</Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Spin spinning={deletingSection || deletingSectionItem}>
                  <TestSectionsNavigator
                    deleteSectionItem={deleteSectionItem}
                    deleteSection={deleteSection}
                    onAddNewItem={onAddNewItem}
                    onAddSection={onAddSection}
                    sections={test.sections}
                    onReorderSections={onReorderSections}
                  />
                </Spin>
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            {!test.sections.length ? (
              <Alert
                message="Generate Tests Paper structure using AI"
                description="You can generate test outline using our AI"
                type="info"
                showIcon
                action={
                  <ActionModal
                    width={600}
                    title="Test Builder"
                    cta={<Button size="small">Generate Tests Paper</Button>}
                  >
                    <AITestPaperBuilder
                      testId={test._id + ''}
                      onValuesChange={(sections: any) => {
                        console.log(sections, 'parseAIJson')
                        updateTest(
                          {
                            id: test._id || '',
                            data: {
                              // @ts-ignore
                              sections: sections
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
                  </ActionModal>
                }
              />
            ) : (
              <Outlet
                context={{ updateTestSection, sections: test.sections }}
              />
            )}
          </Col>
        </Row>
      </Header>
    </AppProvider>
  )
}

export default TestBuilderScreen
