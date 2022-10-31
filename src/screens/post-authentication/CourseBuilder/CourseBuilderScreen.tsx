import { ArrowLeftOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'

import AddItem from './AddItem'
import CourseBuilderTree from './CourseBuilderTree'
import { DataNode } from 'antd/lib/tree'
import styled from '@emotion/styled'
import { useState } from 'react'
import { v4 as uuid } from 'uuid';

const createChapterItemNode  = ():DataNode => {
  return  {
    title: '+ Add Chapter Item',
    key: `item_${uuid()}`,
    children:[]
  }
};

const AddChapterButton = styled(Button)`
margin-top: 20px;
`

function CourseBuilderScreen() {
  const [courseTree, setCourseTree] = useState<DataNode[]>([])
  const onAddNewItem = (type: string, value: string, key?: string) => {
    let CT = [...courseTree]
    const newItem = {
      title: value,
      key: `${type}_${uuid()}`,
      children: [createChapterItemNode()]
    };
    console.log(CT,key)
    if (key) {
      CT.forEach(item => {
        if (!item.children)
        {
          item.children = [];
        }
        item.children.forEach(i => {
          if (i.key === key)
          {
            item?.children?.push(newItem)
          }
        })
        
      })
     }
    else {
      CT.push(newItem)
    }
      

    setCourseTree(CT)
  }

  console.log(courseTree, 'tree');
  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Button icon={<ArrowLeftOutlined />} size="large" type="link">
            Back to courses
          </Button>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[<EyeOutlined />, <EditOutlined />]}
          />

          <Card>
            <CourseBuilderTree onAddNewItem={onAddNewItem} courseTree={courseTree} />
          </Card>

          <AddItem onAddNewItem={onAddNewItem} >
          <AddChapterButton  block type="primary">
      Add New Chapter
    </AddChapterButton>
          </AddItem>
        </Col>
        <Col span={16}>12</Col>
      </Row>
    </div>
  )
}

export default CourseBuilderScreen;
