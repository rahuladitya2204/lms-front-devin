import { Button, Card, Collapse, List, Modal, Space, Tooltip } from 'antd'

import ActionModal from '@Components/ActionModal'
import AddItem from '../AddItem'
import CourseItemIcon from './CourseItemIcon'
import { DeleteOutlined } from '@ant-design/icons'
import Draggable from 'react-draggable'
import { NavLink } from 'react-router-dom'
import { Types } from '@adewaskar/lms-common'
import styled from '@emotion/styled'

const { confirm } = Modal

const CustomCollapse = styled(Collapse)`
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
`

const CourseListItem = styled(List.Item)`
  .ant-list-item {
    padding: 15px !important;
  }
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`
interface CourseSectionsNavigatorPropsI {
  sections: Types.CourseSection[];
  deleteSection: (index: number) => void;
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
  deleteSectionItem
}) => {
  const DeleteSectionItem = (secIndex: number, itemIndex: number) => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
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
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this section`,
      onOk() {
        deleteSection(secIndex)
      },
      okText: 'Delete'
    })
  }
  return (
    <Space size={[20, 20]} direction="vertical" style={{ width: '100%' }}>
      {sections.map((section, secIndex) => {
        return (
          <CustomCollapse
            collapsible="header"
            bordered
            defaultActiveKey={sections.map((s, i) => i)}
            expandIconPosition="end"
            // ghost
          >
            <Collapse.Panel
              key={secIndex}
              header={<span>{`${section.title}`}</span>}
            >
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
            </Collapse.Panel>
          </CustomCollapse>
        )
      })}
    </Space>
  )
}

export default CourseSectionsNavigator
