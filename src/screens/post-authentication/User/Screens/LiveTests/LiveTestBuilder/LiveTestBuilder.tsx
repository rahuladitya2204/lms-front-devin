import { Alert, Button, Card, Col, Form, Modal, Row, Spin } from 'antd'
import { Constants, Types, User, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import BackButton from '@Components/BackButton'
import LiveTestSectionsNavigator from './LiveTestSectionsNavigator'
import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { cloneDeep } from 'lodash'
import useMessage from '@Hooks/useMessage'
import ActionModal from '@Components/ActionModal'
import GenerateWithAI from '@User/Screens/Courses/CourseEditor/CourseInformation/GenerateWithAiButton'
import { updateLiveTestSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'

const { confirm } = Modal

function LiveTestBuilderScreen() {
  const message = useMessage()
  const { id: testId, itemId } = useParams()
  const {
    mutate: updateLiveTest,
    isLoading: loading
  } = User.Queries.useUpdateLiveTest()
  const { data: liveTestDetails } = User.Queries.useGetLiveTestDetails(
    testId + '',
    {
      enabled: !!testId
    }
  )
  const {
    mutate: deleteSectionApi,
    isLoading: deletingSection
  } = User.Queries.useDeleteLiveTestSection()
  const {
    mutate: deleteSectionItemApi,
    isLoading: deletingSectionItem
  } = User.Queries.useDeleteLiveTestSectionItem()
  const [liveTest, setLiveTest] =
        useState<Types.LiveTest>(Constants.INITIAL_LIVE_TEST_DETAILS)
    const navigate = useNavigate()

  const onAddSection = (section: Partial<Types.LiveTestSection>) => {
    console.log(section, 'section')
    let LIVE_TEST = cloneDeep(liveTest)
    if (section._id) {
      LIVE_TEST.sections.forEach((sec, index) => {
        if (sec._id === section._id) {
          LIVE_TEST.sections[index] = { ...sec, ...section }
        }
      })
    } else {
      // @ts-ignore
      const newSection: Types.LiveTestSection = {
        title: section.title + '',
        items: []
      }
      LIVE_TEST.sections.push(newSection)
    }

    updateLiveTest({
      id: testId || '',
      data: {
        sections: LIVE_TEST.sections
      }
    })
  }

  const onAddNewItem = (
    item: Partial<Types.LiveTestQuestion>,
    index: number
  ) => {
    // debugger;
    let LIVE_TEST = cloneDeep(liveTest)
    const sectionId = LIVE_TEST.sections[index]._id
    const newItem: Partial<Types.LiveTestQuestion> = {
      ...item
    }
    // console.log(liveTest, 'livviviv')

    if (item._id) {
      LIVE_TEST.sections[index].items.forEach(
        (i: Types.LiveTestQuestion, itemIndex: number) => {
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
    updateLiveTest({
      id: testId || '',
      data: {
        sections: LIVE_TEST.sections
      }
      //   cb: liveTest => {
      //     if (item._id) {
      //       return navigate(`section/${sectionId}/${type}/${item._id}`)
      //     }
      //     const newlyAdedItem = [...liveTest.sections[index].items].pop()
      //     navigate(`section/${sectionId}/${type}/${newlyAdedItem?._id}`)
      //   }
    })
  }

    const saveLiveTest = (d: Partial<Types.LiveTest>) => {
    const Data={ ...liveTest, ...d };
        console.log(Data, 'aaaaaa');
    if (liveTest._id) {
      updateLiveTest(
        {
          id: testId + '',
          data:Data
        },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'Saved LiveTest'
            })
          }
        }
      )
    }
  }

  //   useEffect(
  //     () => {
  //       if (!itemId) {
  //         const firstSection = liveTest.sections.find(s => s.items.length)
  //         if (firstSection && firstSection.items.length) {
  //           const firstItem = firstSection.items[0]
  //           if (firstItem.type) {
  //             navigate(
  //               `section/${firstSection._id}/${firstItem.type}/${firstItem._id}`
  //             )
  //           }
  //         }
  //       }
  //     },
  //     [liveTest._id]
  //   )

  useEffect(
    () => {
      setLiveTest(liveTestDetails)
    },
    [liveTestDetails]
  )

  const updateLiveTestSection = (
      sectionId: string,
      itemId:string,
    item: Types.LiveTestQuestion
  ) => {
    item._id=itemId;
    const LIVE_TEST = cloneDeep(liveTest)
    LIVE_TEST.sections = updateLiveTestSectionItem(
      LIVE_TEST.sections,
      sectionId,
      item
    )
    // console.log(sectionId,item,LIVE_TEST, 'aaaa');

    setLiveTest(LIVE_TEST)
  }

  const deleteSection = (sectionId: string) => {
    deleteSectionApi(
      {
        data: {
          liveTestId: testId + '',
          sectionId: sectionId
        }
      },
      {
        onSuccess: () => {
          const lastSection = liveTest.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem && lastItem.type)
            navigate(
              `section/${lastSection._id}/${lastItem.type}/${lastItem._id}`
            )
        }
      }
    )
  }

  const deleteSectionItem = (sectionId: string, itemId: string) => {
    const LIVE_TEST = cloneDeep(liveTest)
    // LIVE_TEST.sections[sectionIndex].items.splice(itemIndex, 1)
    deleteSectionItemApi(
      {
        data: {
          liveTestId: testId + '',
          sectionId: sectionId,
          itemId: itemId
        }
      },
      {
        onSuccess: () => {
          const lastSection = liveTest.sections.pop()
          const lastItem = lastSection?.items.pop()
          if (lastSection && lastItem && lastItem.type)
            navigate(
              `section/${lastSection._id}/${lastItem.type}/${lastItem._id}`
            )
        }
      }
    )
  }

  const onReorderSections = (sections: Types.LiveTestSection[]) => {
    const LIVE_TEST = cloneDeep(liveTest)
    LIVE_TEST.sections = sections
    setLiveTest(LIVE_TEST)
    saveLiveTest(LIVE_TEST)
  }
  // const { mutate: updateLiveTestStatus } = User.Queries.useUpdateLiveTestStatus(
  //   testId + ''
  // )
  const { mutate: publishLiveTest } = User.Queries.usePublishLiveTest()
  return (
    <Header
      title={
        <span>
          {' '}
          <BackButton
            onClick={() => navigate('../app/products/liveTests')}
          />{' '}
          {liveTest.title}
        </span>
      }
      extra={[
        <Button
          onClick={() => {
            confirm({
              title: 'Are you sure?',
              content: `You want to publish this liveTest?`,
              onOk() {
                // publishLiveTest({
                //   testId: liveTest._id
                // })
              },
              okText: 'Yes, Publish'
            })
          }}
          //   disabled={!Utils.validatePublishLiveTest(liveTest)}
          style={{ marginRight: 15 }}
          icon={<UploadOutlined />}
        >
          Publish Test
        </Button>,
        <Button
          onClick={() => saveLiveTest(liveTest)}
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
                    type: 'liveTest.thumbnailImage',
                    value: testId + ''
                  }}
                  uploadType="image"
                  prefixKey={`liveTests/${testId}/thumbnailImage`}
                  cropper
                  width="100%"
                  // height="200px"
                  aspect={16 / 9}
                  renderItem={() => (
                    <Image preview={false} src={liveTest.image} />
                  )}
                  onUpload={file => {
                    saveLiveTest({
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
                <LiveTestSectionsNavigator
                  deleteSectionItem={deleteSectionItem}
                  deleteSection={deleteSection}
                  onAddNewItem={onAddNewItem}
                  onAddSection={onAddSection}
                  sections={liveTest.sections}
                  onReorderSections={onReorderSections}
                />
              </Spin>
            </Col>
          </Row>
        </Col>
        <Col span={16}>
          <Outlet context={{updateLiveTestSection,sections: liveTest.sections}} />
        </Col>
      </Row>
    </Header>
  )
}

export default LiveTestBuilderScreen
