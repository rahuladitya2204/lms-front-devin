import { Button, Collapse, List, Modal, Space, Tag, Tooltip } from 'antd'
import { CheckCircleTwoTone, DeleteOutlined, ReadOutlined, WarningTwoTone } from '@ant-design/icons'
import { Constants, Types, User, Utils } from '@invinciblezealorg/lms-common'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MoreButton from '@Components/MoreButton'
import { MovableItem } from '@Components/DragAndDrop/MovableItem'
import { Typography } from '@Components/Typography'
import { cloneDeep } from 'lodash'
import { htmlToText } from 'html-to-text'
import styled from '@emotion/styled'
import update from 'immutability-helper'
import { useModal } from '@Components/ActionModal/ModalContext'

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
  .ant-collapse-header-text {
    width: 65% !important;
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
interface TestEvaluatorNavigatorPropsI {
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

const TestEvaluatorNavigator: React.FC<TestEvaluatorNavigatorPropsI> = ({
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

  const navigate = useNavigate();
  const { openModal } = useModal()
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
 
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
                key: 'add'
              }, {
                label: <span onClick={() => DeleteSection(section._id)}>Delete Section</span>,
                key: 'delete',
              }]} />;
              const actions = [SectionOptionDropdown];
              if (section?.score?.correct) {
                actions.unshift(<Tag style={{ textAlign: 'center' }}
                  color='blue-inverse'>Score(+ {section.score.correct} {(section?.score?.incorrect)?<span>, { section.score.incorrect}</span>:null} )</Tag>)
              }
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
                  <CollapsePanel extra={<Space>{ actions}</Space>}
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
                        const correctOptions = item?.options.map((i, index) => {
                          if (i.isCorrect) {
                            return String.fromCharCode(65 + index);
                          }
                          else {
                            return null;
                          }
                        }).filter(i => i);
                        const {isValid:isQuestionValid,message} = Utils.validateTestQuestion(item,test.languages);
                        if (!isQuestionValid) {
                          actions.unshift(<Tooltip title={message} ><WarningTwoTone twoToneColor="red" /></Tooltip>)
                        }
                        // if (item?.score?.correct) {
                        //   actions.unshift(<Tag style={{ textAlign: 'center' }}
                        //     color='blue-inverse'>
                        //     + {item.score.correct} {(item?.score?.incorrect)?<span>, { item.score.incorrect}</span>:null} </Tag>)
                        // }
                        // if (item?.score?.incorrect) {
                        //   actions.unshift(<Tag style={{ textAlign: 'center' }} color='red-inverse'>
                        //    {item.score.incorrect}</Tag>)
                        // }
                        // if (item.type) {
                        //   actions.unshift(<Tag style={{ textAlign: 'center',textTransform:"capitalize" }} color='blue'>{item.type}</Tag>)
                        // }
                        if (correctOptions.length) {
                          actions.unshift(<Tag style={{ textAlign: 'center' }} color='orange-inverse'>
                            {correctOptions.join(',')}</Tag>)
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

    </Space>
  )
}

export default TestEvaluatorNavigator
