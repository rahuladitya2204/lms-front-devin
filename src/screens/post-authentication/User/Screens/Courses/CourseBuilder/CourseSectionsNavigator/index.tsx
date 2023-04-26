import { Button, Card, Collapse, List, Modal, Space, Tooltip, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import AddItem from '../AddItem'
import CourseItemIcon from './CourseItemIcon'
import CreateHeading from '../CreateNewItem/CreateHeading'
import { DeleteOutlined } from '@ant-design/icons'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MovableItem } from '@Components/DragAndDrop/MovableItem'
import { NavLink } from 'react-router-dom'
import { Types } from '@adewaskar/lms-common'
import styled from '@emotion/styled'
import update from 'immutability-helper'

const { confirm } = Modal;
const {Title } = Typography;

const AddChapterButton = styled(Button)`
  /* margin-top: 10px; */
  /* margin-bottom: 10px; */
`


const CustomCollapse = styled(Collapse)((props: { enableSectionReorder: boolean }) =>`
    margin-top: 10px;
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
  ${props.enableSectionReorder ? `
  border: 1px dashed;
  cursor: move;
  `
  :`
  `
}
`)

const CourseListItem = styled(List.Item)`
  .ant-list-item {
    padding: 15px !important;
  }
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`
interface CourseSectionsNavigatorPropsI {
  sections: Types.CourseSection[];
  onAddSection: Function;
  deleteSection: (index: number) => void;
  onReorderSections:(s: Types.CourseSection[]) => void;
  deleteSectionItem: (sectionIndex: number, itemIndex: number) => void;
  onAddNewItem: (
    type: string,
    item: Partial<Types.CourseSectionItem>,
    index: number
  ) => void;
}

const CourseSectionsNavigator: React.FC<CourseSectionsNavigatorPropsI> = ({
  sections,
  onAddNewItem,
  deleteSection,
  onAddSection,
  deleteSectionItem,
  onReorderSections
}) => {
  const [enableSectionReorder, setEnableSectionReorder] = useState(false);
  const [sectionList, setSectionList] = useState<Types.CourseSection[]>(sections)
  useEffect(
    () => {
      setSectionList(sections)
    },
    [sections]
  );
  const DeleteSectionItem = (secIndex: number, itemIndex: number) => {
    confirm({
      title: 'Are you sure?',
      content: `You want to delete this section item`,
      onOk() {
        deleteSectionItem(secIndex, itemIndex)
      },
      okText: 'Delete'
    })
  }

  const DeleteSection = (secIndex: number) => {
    confirm({
      title: 'Are you sure?',
      content: `You want to delete this section`,
      onOk() {
        deleteSection(secIndex)
      },
      okText: 'Delete'
    })
  }

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setSectionList(prevCards =>
      update(prevCards, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, prevCards[dragIndex]]]
      })
    )
  }, []);
  console.log(sectionList,'sectionList')
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
                 <Card title={enableSectionReorder?(<Title level={4} style={{textAlign:'center'}}>Drag and Drop sections below</Title>):null
}>
   <DndProvider backend={HTML5Backend}>
        {sectionList.map((section, secIndex) => {
          return (
            <MovableItem disabled={!enableSectionReorder}
              key={section._id}
              index={secIndex}
              moveItem={moveItem}
              id={section._id}
            >
              <CustomCollapse
                collapsible="header"
                bordered
                enableSectionReorder={enableSectionReorder}
                defaultActiveKey={sectionList.map((s, i) => i)}
                expandIconPosition="end"
                // ghost
              >
                <Collapse.Panel
                  key={secIndex}
                  header={<span>{`${section.title}`}</span>}
                >
                        <DndProvider backend={HTML5Backend}>

                  <List
                    itemLayout="horizontal"
                    style={{ marginBottom: 20 }}
                    size="small"
                    dataSource={section.items}
                    footer={
                      <Space>
                        <ActionModal
                          cta={
                            <Button size="small" type="primary">
                              Add New Item{' '}
                            </Button>
                          }
                        >
                          <AddItem
                            onAddNewItem={(key, value) =>
                              onAddNewItem(key, value, secIndex)
                            }
                          />
                        </ActionModal>

                        <Tooltip
                          placement="bottom"
                          title={'Delete this complete section of course'}
                        >
                          <Button
                            onClick={() => DeleteSection(secIndex)}
                            size="small"
                            // type="ghost"
                          >
                            Delete Section{' '}
                          </Button>
                        </Tooltip>
                      </Space>
                    }
                    renderItem={(item, itemIndex) => (
                      <List.Item style={{ padding: 0 }}>
                        <NavLink
                          style={{ width: '100%' }}
                          key={item._id}
                          to={`section/${section._id}/${item.type}/${item._id}`}
                          children={({ isActive }) => (
                            <CourseListItem
                              isActive={isActive}
                              actions={[
                                <Tooltip
                                  placement="bottom"
                                  title={'Delete Section item'}
                                >
                                  <DeleteOutlined
                                    onClick={() =>
                                      DeleteSectionItem(secIndex, itemIndex)
                                    }
                                  />
                                </Tooltip>
                              ]}
                            >
                              <List.Item.Meta
                                style={{ cursor: 'pointer' }}
                                title={item.title}
                                avatar={
                                  <CourseItemIcon type="outlined" item={item} />
                                }
                              />
                            </CourseListItem>
                          )}
                        />
                      </List.Item>
                    )}
                    />
                    </DndProvider>
                </Collapse.Panel>
              </CustomCollapse>
            </MovableItem>
          )
        })}
        </DndProvider>

        {!enableSectionReorder? <AddChapterButton style={{marginTop:20}} type="primary" danger onClick={e=>setEnableSectionReorder(!enableSectionReorder)} block>
                Rearrange Sections
      </AddChapterButton> : <AddChapterButton style={{marginTop:20}}danger onClick={e => {
          onReorderSections(sectionList);
          setEnableSectionReorder(false)
      }} block>
                Save Order
              </AddChapterButton>}
        </Card>

      <CreateHeading onFinish={e => onAddSection(e)}>
              <AddChapterButton block type="primary">
                Add New Section
              </AddChapterButton>
            </CreateHeading>
    </Space>
  )
}

export default CourseSectionsNavigator
