import { Alert, Button, Col, Form, Modal, Row, Spin, Tag } from 'antd'
import { Constants, Enum, Types, User, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { cloneDeep, debounce } from 'lodash'
import { useEffect, useState } from 'react'

import AITestPaperBuilder from './AITestBuilder/AITestBuilder'
import ActionModal from '@Components/ActionModal'
import AppProvider from 'screens/AppProvider'
import BackButton from '@Components/BackButton'
import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import SetTestRules from './SetTestRules'
import TestOutline from './TestOutline'
import TestSectionsNavigator from './TestSectionsNavigator'
import { updateTestSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal

function TestBuilderScreen() {
  const message = useMessage()
  const {
    mutate: updateTestApi,
    isLoading: savingTest
  } = User.Queries.useUpdateTest()
  const updateTest = debounce(updateTestApi, 1000)
  const { id: testId, itemId } = useParams()
  const { data: testDetails,isFetching: loadingTest,isLoading: loadingTestFirst } = User.Queries.useGetTestDetails(testId + '', {
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
        useState<Types.Test>(Constants.INITIAL_TEST_DETAILS)
  const navigate = useNavigate()

  const onAddSection = (section: Partial<Types.TestSection>) => {
    // console.log(section, 'section')
    let TEST = cloneDeep(test)
    if (section._id) {
      TEST.sections.forEach((sec, index) => {
        if (sec._id === section._id) {
          TEST.sections[index] = { ...sec, ...section }
        }
      })
    } else {
      // @ts-ignore
      const newSection: Types.TestSection = {
        title: section.title + '',
        items: [
          {
            ...Constants.INITIAL_TEST_QUESTION,
            title: 'New Question',
            options: [Constants.INITIAL_TEST_QUESTION_OPTION,Constants.INITIAL_TEST_QUESTION_OPTION,Constants.INITIAL_TEST_QUESTION_OPTION,Constants.INITIAL_TEST_QUESTION_OPTION],
            solution: {
              html:''
            },
            _id: undefined
          }
        ]
      }
      TEST.sections.push(newSection)
    }

    updateTest(
      {
        id: testId || '',
        data: {
          sections: TEST.sections
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
            `../app/products/test/${TEST._id}/builder/${
              newlyAdedItem?._id
            }`
          )
        }
      }
    )
  }

  const onAddNewItem = (item: Partial<Types.TestQuestion>, index: number) => {
    // debugger;
    let TEST = cloneDeep(test)
    const newItem: Partial<Types.TestQuestion> = {
      ...item
    }
    // console.log(test, 'livviviv')

    if (item._id) {
      TEST.sections[index].items.forEach(
        (i: Types.TestQuestion, itemIndex: number) => {
          if (i._id === item._id) {
            // @ts-ignore
            TEST.sections[index].items[itemIndex] = {
              ...item,
              ...newItem
            }
          }
        }
      )
    } else {
      // @ts-ignore
      TEST.sections[index].items.push(newItem)
    }
    updateTest(
      {
        id: testId || '',
        data: {
          sections: TEST.sections
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
            `../app/products/test/${TEST._id}/builder/${
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
            // message.open({
            //   type: 'success',
            //   content: 'Saved Test'
            // })
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

  const updateTestSection = (itemId: string, item: Types.TestQuestion) => {
    item._id = itemId
    const TEST = cloneDeep(test)
    TEST.sections = updateTestSectionItem(TEST.sections, item)

    saveTest({
      sections: TEST.sections
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
    const TEST = cloneDeep(test)
    deleteSectionItemApi(
      {
        data: {
          testId: testId + '',
          // sectionId: sectionId,
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
    const TEST = cloneDeep(test)
    TEST.sections = sections
    setTest(TEST)
    saveTest(TEST)
  }
  // const { mutate: updateTestStatus } = User.Queries.useUpdateTestStatus(
  //   testId + ''
  // )
  const { mutate: publishTest } = User.Queries.usePublishTest()
  const isTestEnded = test.isLive && test.status === Enum.TestStatus.ENDED;
  return (
    <AppProvider>
      <Header
        title={
          <span>
            {' '}
            <BackButton onClick={() => navigate('../app/products/test')} />
            {test.title} {(!test.isLive) ? <Tag color='blur'>Live Test</Tag> : null}
          </span>
        }
        extra={[
          <Row>   <Col span={24}>
          {!test.sections.length ? (
                  <ActionModal
                  title="Reset Test Outline"
                  width={900}
                  cta={
                    <Button type='primary' style={{marginRight:10}} size="small">Generate Test Outline</Button>
                  }
              >
      <TestOutline testId={testId + ''} />

            </ActionModal>
                ) : (
                null
            // <ActionModal
            //       title="Reset Test Outline"
            //       width={900}
            //       cta={
            //         <Button  style={{marginRight:20}} danger type='primary' size="small">Reset Test Outline</Button>
            //       }
            //     >
            //       <TestOutline testId={testId + ''} />
            //     </ActionModal>
          )}
        </Col></Row>,
          <Tag>
            {(savingTest || loadingTest) ? 'Saving..' : `Changes will be automatically saved`}
          </Tag>,
          test.status === Enum.TestStatus.PUBLISHED ? (
            <Tag color="green">Test is Published</Tag>
          ) : isTestEnded ? (
            <Tag color="green">Test has ended</Tag>
          ) : null
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
                    // width="100%"
                    height="200px"
                    aspect={16 / 9}
                    renderItem={() => (
                      <Image preview={false} src={test.thumbnailImage} />
                    )}
                    onUpload={file => {
                      saveTest({
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
                                             <SetTestRules testId={testId + ''} />

                      </ActionModal>                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Spin tip='Please wait..' spinning={deletingSection || deletingSectionItem || loadingTest}>
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
            <Row gutter={[20, 20]}>
              <Col span={24}>
                <Outlet
                  context={{ updateTestSection, sections: test.sections }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    </AppProvider>
  )
}

export default TestBuilderScreen
