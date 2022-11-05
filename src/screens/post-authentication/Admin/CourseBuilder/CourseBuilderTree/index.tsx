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
  onAddNewItem: (
    type: string,
    item: CourseNodeValueType,
    index: number
  ) => void;
}

const CourseSection: React.FC<CourseSectionPropsI> = ({
  courseSections,
  onAddNewItem
}) => {
  const navigate = useNavigate()
  console.log(courseSections, 'courseSections')
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Collapse
        collapsible="header"
        defaultActiveKey={courseSections.map((s, i) => i)}
        expandIconPosition="end"
      >
        {courseSections.map((section, secIndex) => {
          return (
            <Collapse.Panel header={`${section.title}`} key={secIndex}>
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
                    />
                  </Card>
                )
              })}
              <AddItem
                onAddNewItem={(key, value) =>
                  onAddNewItem(key, value, secIndex)
                }
              >
                <Button size="small" block type="primary">
                  Add New Item{' '}
                </Button>
              </AddItem>
            </Collapse.Panel>
          )
        })}
      </Collapse>
    </Card>
  )
}

export default CourseSection
