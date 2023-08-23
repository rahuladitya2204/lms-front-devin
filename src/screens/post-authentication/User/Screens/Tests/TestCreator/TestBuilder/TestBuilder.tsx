import { Alert, Button, Col, Form, Modal, Row, Spin, Tag } from 'antd'
import { Constants, Enum, Types, User, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import AITestPaperBuilder from './AITestBuilder/AITestBuilder'
import ActionModal from '@Components/ActionModal'
import BackButton from '@Components/BackButton'
import GenerateWithAI from './AITestBuilder/GenerateWithAiButton'
import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import TestSectionsNavigator from './TestSectionsNavigator'
import { cloneDeep } from 'lodash'
import { updateTestSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal

function TestBuilderScreen() {
  const message = useMessage()
  const { id: testId, itemId } = useParams()
  const {
    mutate: updateTest,
    isLoading: loading
  } = User.Queries.useUpdateTest()
  const { data: TestDetails } = User.Queries.useGetTestDetails(
    testId + '',
    {
      enabled: !!testId
    }
  )
  const {
    mutate: deleteSectionApi,
    isLoading: deletingSection
  } = User.Queries.useDeleteTestSection()
  const {
    mutate: deleteSectionItemApi,
    isLoading: deletingSectionItem
  } = User.Queries.useDeleteTestSectionItem()
  const [Test, setTest] =
        useState<Types.Test>(Constants.INITIAL_LIVE_TEST_DETAILS)
  const navigate = useNavigate()

  const onAddSection = (section: Partial<Types.TestSection>) => {
    // console.log(section, 'section')
    let LIVE_TEST = cloneDeep(Test)
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
        items: []
      }
      LIVE_TEST.sections.push(newSection)
    }

    updateTest({
      id: testId || '',
      data: {
        sections: LIVE_TEST.sections
      }
    })
  }

  const onAddNewItem = (
    item: Partial<Types.TestQuestion>,
    index: number
  ) => {
    // debugger;
    let LIVE_TEST = cloneDeep(Test)
    const newItem: Partial<Types.TestQuestion> = {
      ...item
    }
    // console.log(Test, 'livviviv')

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
        onSuccess: Test => {
          if (item._id) {
            return navigate(`${item._id}`)
          }
          const newlyAdedItem = [...Test.sections[index].items].pop()
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
    const Data = { ...Test, ...d }
    if (Test._id) {
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
        const firstSection = Test.sections.find(s => s.items.length)
        if (firstSection && firstSection.items.length) {
          const firstItem = firstSection.items[0]
          if (firstItem.type) {
            navigate(`${firstItem._id}`)
          }
        }
      }
    },
    [Test._id]
  )

  useEffect(
    () => {
      setTest(TestDetails)
    },
    [TestDetails]
  )

  const updateTestSection = (
    sectionId: string,
    itemId: string,
    item: Types.TestQuestion
  ) => {
    item._id = itemId
    const LIVE_TEST = cloneDeep(Test)
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
          const lastSection = Test.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem) navigate(`${lastItem._id}`)
        }
      }
    )
  }

  const deleteSectionItem = (sectionId: string, itemId: string) => {
    const LIVE_TEST = cloneDeep(Test)
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
          const lastSection = Test.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem) navigate(`${lastItem._id}`)
        }
      }
    )
  }

  const onReorderSections = (sections: Types.TestSection[]) => {
    const LIVE_TEST = cloneDeep(Test)
    LIVE_TEST.sections = sections
    setTest(LIVE_TEST)
    saveTest(LIVE_TEST)
  }
  // const { mutate: updateTestStatus } = User.Queries.useUpdateTestStatus(
  //   testId + ''
  // )
  const { mutate: publishTest } = User.Queries.usePublishTest()
  return (
    <Header
      title={
        <span>
          {' '}
          <BackButton
            onClick={() => navigate('../app/products/test')}
          />{' '}
          {Test.title}
        </span>
      }
      extra={[
        Test.status === Enum.TestStatus.PUBLISHED ? (
          <Tag color='green'>Test is published</Tag>
        ):
        <Button
          onClick={() => {
            confirm({
              title: 'Are you sure?',
              content: `You want to publish this Test?`,
              onOk() {
                // publishTest({
                //   testId: Test._id
                // })
              },
              okText: 'Yes, Publish'
            })
          }}
            disabled={!Utils.validatePublishTest(Test)}
          style={{ marginRight: 15 }}
          icon={<UploadOutlined />}
        >
          Publish
        </Button>,
        <Button
          onClick={() => saveTest(Test)}
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
                    type: 'Test.thumbnailImage',
                    value: testId + ''
                  }}
                  uploadType="image"
                  prefixKey={`Tests/${testId}/thumbnailImage`}
                  cropper
                  width="100%"
                  // height="200px"
                  aspect={16 / 9}
                  renderItem={() => (
                    <Image preview={false} src={Test.image} />
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
                  sections={Test.sections}
                  onReorderSections={onReorderSections}
                />
              </Spin>
            </Col>
          </Row>
        </Col>
        <Col span={16}>
          {!Test.sections.length ? (
            <Alert
              message="Generate Tests Paper structure using AI"
              description="You can generate Test outline using our AI"
              type="info"
              showIcon
              action={
                <ActionModal width={600} title='Test Builder' cta={ <Button size='small'>Generate Tests Paper</Button>}>
                  <AITestPaperBuilder
                    testId={Test._id + ''}
                    onValuesChange={(sections: any) => {
                      console.log(sections, 'parseAIJson')
                      updateTest(
                        {
                          id: Test._id || '',
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
              context={{ updateTestSection, sections: Test.sections }}
            />
          )}
        </Col>
      </Row>
    </Header>
  )
}

export default TestBuilderScreen
