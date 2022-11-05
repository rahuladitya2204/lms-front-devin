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
} from '../../../../../types/Common.types'

import AddItem from '../AddItem'
import CourseBuilderTreeNode from './CourseBuilderTreeNode'
import { DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'

interface CourseSectionPropsI {
  courseSections: CourseSectionItem[];
  deleteSection: (index: number) => void;
  deleteSectionItem: (sectionIndex: number, itemIndex: number) => void;
  onAddNewItem: (
    type: string,
    item: CourseNodeValueType,
    index: number
  ) => void;
}

const CourseSection: React.FC<CourseSectionPropsI> = ({
  courseSections,
  onAddNewItem,
  deleteSection
}) => {
  const navigate = useNavigate()
  console.log(courseSections, 'courseSections')
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Collapse
        collapsible="header"
        defaultActiveKey={courseSections.map((s, i) => i + '')}
        expandIconPosition="end"
      >
        {courseSections.map((section, secIndex) => {
          return (
            <Collapse.Panel header={`${section.title}`} key={secIndex}>
              <List
                itemLayout="horizontal"
                style={{ marginBottom: 20 }}
                size="small"
                dataSource={section.items}
                renderItem={item => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    actions={[
                      <Popconfirm
                        placement="right"
                        title={`Are you sure to delete this item?`}
                        onConfirm={() => deleteSection(secIndex)}
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
                    <CourseBuilderTreeNode item={item} />
                  </List.Item>
                )}
              />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  {' '}
                  <AddItem
                    onAddNewItem={(key, value) =>
                      onAddNewItem(key, value, secIndex)
                    }
                  >
                    <Button size="small" type="primary">
                      Add New Item{' '}
                    </Button>
                  </AddItem>
                </Col>
                <Col span={12}>
                  <Popconfirm
                    placement="right"
                    title={`Are you sure to delete this section?`}
                    onConfirm={() => deleteSection(secIndex)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip placement="bottom" title={'Delete Section'}>
                      <Button size="small" type="ghost">
                        Delete Section{' '}
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                </Col>
              </Row>
            </Collapse.Panel>
          )
        })}
      </Collapse>
    </Card>
  )
}

export default CourseSection
