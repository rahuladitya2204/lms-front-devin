import { Button, Card, Collapse, Dropdown, Menu, MenuProps, Space } from 'antd'
import {
  CourseNodeValueType,
  CourseSectionItem
} from '../../../../../types/Common.types'

import AddItem from '../AddItem'
import { DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'

interface CourseSectionPropsI {
  courseSections: CourseSectionItem[];
  onAddNewItem: (type: string, item: CourseNodeValueType, id?: string) => void;
}

const CourseSection: React.FC<CourseSectionPropsI> = ({
  courseSections,
  onAddNewItem
}) => {
  const navigate = useNavigate()
  console.log(courseSections,'courseSections')
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Collapse
        collapsible="header"
        defaultActiveKey={['1']}
        expandIconPosition="end"
      >
        {courseSections.map(section => {
          return (
            <Collapse.Panel header={`${section.title}`} key="1">
              <Space direction="vertical" size={'middle'}>
                {section.items?.map(child => {
                  const menu = (
                    <Menu>
                      <Menu.Item key="1">Item 1</Menu.Item>
                      <Menu.Item key="2">Item 2</Menu.Item>
                      <Menu.Item key="3">Item 3</Menu.Item>
                      <Menu.Divider />
                      <Menu.Item key="3">Logout</Menu.Item>
                    </Menu>
                  )

                  return (
                    <Card>
                      {`${child.title}`}{' '}
                      <Dropdown.Button
                        overlay={menu}
                        trigger={['click']}
                        icon={<DownOutlined />}
                        type="primary"
                      >

                      </Dropdown.Button>
                    </Card>
                  )
                })}
                <AddItem
                  onAddNewItem={(key, value) =>
                    onAddNewItem(key, value, section.id)
                  }
                >
                  <Button block type="primary">
                    Add New Item{' '}
                  </Button>
                </AddItem>
              </Space>
            </Collapse.Panel>
          )
        })}
      </Collapse>
    </Card>
  )
}

export default CourseSection
