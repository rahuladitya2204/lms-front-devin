import { Button, Collapse, List, Modal, Space, Tag, Tooltip } from 'antd'
import { CheckCircleTwoTone, DeleteOutlined, ReadOutlined, WarningTwoTone } from '@ant-design/icons'
import { Constants, Types, User, Utils } from '@adewaskar/lms-common'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddTestSection from './AddSection'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MoreButton from '@Components/MoreButton'
import { MovableItem } from '@Components/DragAndDrop/MovableItem'
import { Typography } from '@Components/Typography'
import { cloneDeep } from 'lodash'
import { htmlToText } from 'html-to-text'
import styled from '@emotion/styled'
import update from 'immutability-helper'

const { confirm } = Modal;
const { Title, Text } = Typography;

const CollapsePanel = styled(Collapse.Panel)`
.ant-collapse-header-text{
  width: 85%;
}
`


const AddChapterButton = styled(Button)`
  /* margin-top: 10px; */
  /* margin-bottom: 10px; */
`


const CustomCollapse = styled(Collapse)((props: { enableSectionReorder: boolean }) =>`
    // margin-top: 10px;
  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-list-item-meta-title {
    margin-top: 0;
  }

  .ant-list-footer {
    padding-bottom: 0;
  }

  .ant-space {
    display: flex;
    gap: 8px;
    justify-content: space-around;
  }

  .ant-list-item {
    span{
      width: 100% !important;
    }
  }
}
`)

const TestListItem = styled(List.Item)`
  .ant-list-item {
    padding: 15px !important;
    span{
      width: 100% !important;
    }
  }
  .delete-icon {
      visibility: hidden;
    }
  &:hover{
    .delete-icon {
      visibility: visible;
    }
  }
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`
interface TestSectionsNavigatorPropsI {
  sections: Types.TestSection[];
  onAddSection: Function;
  deleteSection: (sId: string) => void;
  onReorderSections:(s: Types.TestSection[]) => void;
  deleteSectionItem: (secId: string, itemID: string) => void;
  testId: string;
  onAddNewItem: (
    item: Partial<Types.TestQuestion>,
    index: number
  ) => void;
}

const TestSectionsNavigator: React.FC<TestSectionsNavigatorPropsI> = ({
  sections,
  onAddNewItem,
  testId,
  deleteSection,
  onAddSection,
  deleteSectionItem,
  onReorderSections
}) => {
  const { data: test } = User.Queries.useGetTestDetails(testId);
  const [enableSectionReorder, setEnableSectionReorder] = useState(true);
  const [itemRearrengeIndex, setItemRearrengeIndex] = useState<number | null>(null);
  const [sectionList, setSectionList] = useState<Types.TestSection[]>(sections)
  useEffect(
    () => {
      setSectionList(sections)
    },
    [sections]
  );
  const DeleteSectionItem = (sectionId: string, itemId: string) => {
    confirm({
      title: 'Are you sure?',
      content: `You want to delete this section item`,
      onOk() {
        deleteSectionItem(sectionId, itemId)
      },
      okText: 'Delete'
    })
  }

  const DeleteSection = (sectionId: string) => {
    confirm({
      title: 'Are you sure?',
      content: `You want to delete this section`,
      onOk() {
        deleteSection(sectionId)
      },
      okText: 'Delete'
    })
  }

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setSectionList(prevCards => {
      const prevSections = cloneDeep(prevCards);
      const sections = update(prevSections, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, prevSections[dragIndex]]]
      });
      onReorderSections(sections)
      return sections;
    }
    )
  }, []);

  const moveTestItem = useCallback((dragIndex: number, hoverIndex: number, sectonId: string, itemId:string) => {
    const SList = [...sectionList];
    SList.forEach(section => {
      if (section._id === sectonId) {
        section.items = update(section.items, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, section.items[dragIndex]]]
        });
      }
    });
    setSectionList(SList);
  }, []);
  const navigate = useNavigate();
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
   <DndProvider backend={HTML5Backend}>
        {sectionList.map((section, secIndex) => {
          const SectionOptionDropdown = <MoreButton
            items={[
              {
                label: 'Add Question',
                onClick: () => {
                  onAddNewItem({
                    title: {
                      text: Constants.INITIAL_LANG_TEXT
                    }, options: [Constants.INITIAL_TEST_QUESTION_OPTION, Constants.INITIAL_TEST_QUESTION_OPTION, Constants.INITIAL_TEST_QUESTION_OPTION, Constants.INITIAL_TEST_QUESTION_OPTION]
                    , solution: { html: '' }
                  }, secIndex);
                  // if(section.items.length==0)
                },
                  key:'add'
              },{
                label: <ActionModal cta={`Edit Section`}>
                  <AddTestSection data={section} onFinish={(e: { title: string }) => onAddSection({ ...section, ...e })} />
                  </ActionModal>,
            key: 'rename',
          }, {
            label: <span onClick={() => DeleteSection(section._id)}>Delete Section</span>,
            key: 'delete',
            }]} />
          return (
            <div style={{marginBottom:20}}>
            <MovableItem disabled={!enableSectionReorder}
              key={section._id}
              index={secIndex}
              moveItem={moveSection}
              id={section._id}
            >
              <CustomCollapse
                collapsible="header"
                bordered
                enableSectionReorder={!enableSectionReorder}
                defaultActiveKey={sectionList.map((s, i) => i)}
                expandIconPosition="start"
                // ghost
              >
                  <CollapsePanel extra={
                   SectionOptionDropdown
                    }
                    key={secIndex}
                    header={section.title}
                >
                  <List
                    itemLayout="horizontal"
                    style={{ marginBottom: 20 }}
                    size="small"
                    dataSource={section.items}

                      renderItem={(item, itemIndex) => {
                        // This propagation is being stopped to prevent dropdown also making list item clickable
                        const SectionItemOptionDropdown = <span onClick={e => e.stopPropagation()}>
                          <MoreButton items={[
                            {
                              label: <span onClick={(e) => {
                                // e.stopPropagation()
                                DeleteSectionItem(section._id, item._id)
                              }}>Delete Question</span>,
                              key: 'delete',
                              icon: <DeleteOutlined />
                            }]} />
                        </span>;
                        const actions = [
                          SectionItemOptionDropdown
                        ];
                        const {isValid:isQuestionValid,message} = Utils.validateTestQuestion(item,test.languages);
                        if (!isQuestionValid) {
                          actions.unshift(<Tooltip title={message} ><WarningTwoTone twoToneColor="red" /></Tooltip>)
                        }
                        if (item?.score?.correct) {
                          actions.unshift(<Tag style={{ textAlign: 'center' }} color='blue-inverse'>
                            + {item.score.correct}</Tag>)
                        }
                        if (item?.score?.incorrect) {
                          actions.unshift(<Tag style={{ textAlign: 'center' }} color='red-inverse'>
                           {item.score.incorrect}</Tag>)
                        }
                        if (item.type) {
                          actions.unshift(<Tag style={{ textAlign: 'center',textTransform:"capitalize" }} color='blue'>{item.type}</Tag>)
                        }
                        const TestSectionListItem = (isActive: boolean) => <TestListItem
                        isActive={isActive}
                          actions={actions}
                      >
                        <List.Item.Meta
                          style={{ cursor: 'pointer' }}
                          // title={<Text>{htmlToText(item.title)}</Text>}
                          title={<Text>{`Question ${itemIndex+1}`}</Text>}
                          avatar={
                            <ReadOutlined />
                          }
                        />
                      </TestListItem>
                        return <Fragment>
                          <MovableItem
                          disabled={!(itemRearrengeIndex === secIndex)}
                          key={item._id}
                          index={itemIndex}
                          moveItem={(dragIndex, hoverIndex) => moveTestItem(dragIndex, hoverIndex, section._id, item._id)}
                          id={item._id}
                        >
                            <List.Item style={{ padding: 0, background: isQuestionValid ?'transparent':'#fff1f0' }}>
                         <NavLink
                              style={{ width: '100%' }}
                              key={item._id}
                                to={item._id} onClick={(e) => {
                                  e.preventDefault();
                                  navigate(item._id)
                                }}
                              children={({ isActive }) => TestSectionListItem(isActive)}
                              />
                          </List.Item>
                          </MovableItem>

                          {(itemIndex === section.items.length - 1) ?
                            null
                          //   <ActionModal
                          //   cta={<AddItemListCta
                          //     >
                          //       <List.Item.Meta
                          //         style={{ cursor: 'pointer' }}
                          //         title={AddItemCTA}
                          //         avatar={
                          //           <PlusOutlined/>
                          //         }
                          //       />
                          //     </AddItemListCta>}
                          // >
                          //   <AddItem
                          //     onAddNewItem={(key, value) =>
                          //       onAddNewItem(key, value, secIndex)
                          //     }
                          //   />
                          // </ActionModal>
                            :null}
                       </Fragment>
                      }}
                    />

                </CollapsePanel>
              </CustomCollapse>
              </MovableItem>
              </div>
          )
        })}
        </DndProvider>

        {/* @ts-ignore */}
      <ActionModal cta={<AddChapterButton block type="primary">
                Add New Section
              </AddChapterButton>}>
      <AddTestSection onFinish={e => onAddSection(e)} />
        </ActionModal>
    </Space>
  )
}

export default TestSectionsNavigator
