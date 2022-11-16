import {
  Button,
  Card,
  Collapse,
  List,
  Popconfirm,
  Space,
  Tooltip,
  Typography
} from 'antd'

import AddItem from '../AddItem'
import CourseItemIcon from './CourseItemIcon'
import { DeleteOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { CourseSection, CourseSectionItem } from '@Types/Courses.types'
import confirm from 'antd/lib/modal/confirm'

const CustomCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0;
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
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`
interface CourseSectionsNavigatorPropsI {
  sections: CourseSection[];
  deleteSection: (index: number) => void;
  deleteSectionItem: (sectionIndex: number, itemIndex: number) => void;
  onAddNewItem: (
    type: string,
    item: Partial<CourseSectionItem>,
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
    <Card bodyStyle={{ padding: 0 }}>
      <CustomCollapse
        collapsible="header"
        defaultActiveKey={sections.map((s, i) => s.id)}
        expandIconPosition="end"
      >
        {sections.map((section, secIndex) => {
          return (
            <Collapse.Panel
              key={section.id}
              header={
                <span onClick={e => console.log(e, 'eee')}>{`${
                  section.title
                }`}</span>
              }
            >
              <List
                itemLayout="horizontal"
                style={{ marginBottom: 20 }}
                size="small"
                dataSource={section.items}
                footer={
                  <Space>
                    <AddItem
                      onAddNewItem={(key, value) =>
                        onAddNewItem(key, value, secIndex)
                      }
                    >
                      <Button size="small" type="primary">
                        Add New Item{' '}
                      </Button>
                    </AddItem>

                    <Tooltip
                      placement="bottom"
                      title={'Delete this complete section of course'}
                    >
                      <Button
                        onClick={() => DeleteSection(secIndex)}
                        size="small"
                        type="ghost"
                      >
                        Delete Section{' '}
                      </Button>
                    </Tooltip>
                  </Space>
                }
                renderItem={(item, itemIndex) => (
                  <NavLink
                    key={item.id}
                    to={`section/${section.id}/${item.type}/${item.id}`}
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
                          title={
                            <Typography.Text ellipsis>
                              {item.title}
                            </Typography.Text>
                          }
                          avatar={<CourseItemIcon item={item} />}
                        />
                      </CourseListItem>
                    )}
                  />
                )}
              />
            </Collapse.Panel>
          )
        })}
      </CustomCollapse>
    </Card>
  )
}

export default CourseSectionsNavigator
