import {
  Button,
  Card,
  Col,
  Collapse,
  List,
  Popconfirm,
  Row,
  Space,
  Tooltip
} from 'antd'
import {
  CourseNodeValueType,
  CourseSectionItem
} from '../../../../../../types/Common.types'

import AddItem from '../AddItem'
import CourseItemIcon from './CourseItemIcon'
import { DeleteOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'

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
interface CourseSectionPropsI {
  sections: CourseSectionItem[];
  deleteSection: (index: number) => void;
  deleteSectionItem: (sectionIndex: number, itemIndex: number) => void;
  onAddNewItem: (
    type: string,
    item: CourseNodeValueType,
    index: number
  ) => void;
}

const CourseSection: React.FC<CourseSectionPropsI> = ({
  sections,
  onAddNewItem,
  deleteSection,
  deleteSectionItem
}) => {
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <CustomCollapse
        collapsible="header"
        defaultActiveKey={sections.map((s, i) => i + '')}
        expandIconPosition="end"
      >
        {sections.map((section, secIndex) => {
          return (
            <Collapse.Panel
              header={
                <span onClick={e => console.log(e, 'eee')}>{`${
                  section.title
                }`}</span>
              }
              key={secIndex}
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
                    <Popconfirm
                      placement="right"
                      title={`Are you sure to delete this section?`}
                      onConfirm={() => deleteSection(secIndex)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip
                        placement="bottom"
                        title={'Delete this complete section of course'}
                      >
                        <Button size="small" type="ghost">
                          Delete Section{' '}
                        </Button>
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                }
                renderItem={(item, itemIndex) => (
                  <NavLink
                    to={`${item.type}/${item.id}`}
                    children={({ isActive }) => (
                      <CourseListItem
                        isActive={isActive}
                        actions={[
                          <Popconfirm
                            placement="right"
                            title={`Are you sure to delete this item?`}
                            onConfirm={() =>
                              deleteSectionItem(secIndex, itemIndex)
                            }
                            okText="Yes"
                            cancelText="No"
                          >
                            <Tooltip
                              placement="bottom"
                              title={'Delete Section item'}
                            >
                              <DeleteOutlined />
                            </Tooltip>
                          </Popconfirm>
                        ]}
                      >
                        <List.Item.Meta
                          style={{ cursor: 'pointer' }}
                          title={item.title}
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

export default CourseSection
