import { ArrowLeftOutlined, EditOutlined, EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useGetCourseDetails, useUpdateCourse } from '../../../queries/Courses/CoursesQueries'

import AddItem from './AddItem'
import CourseBuilderTree from './CourseBuilderTree'
import { CourseNodeValueType } from '../../../types/Common.types'
import { DataNode } from 'antd/lib/tree'
import styled from '@emotion/styled'
import { useState } from 'react'
import { v4 as uuid } from 'uuid';

const createChapterItemNode = (): DataNode => {
  const keyId: string = JSON.stringify({
    id: uuid(),
    value: '',
    type: 'item'
  });
  return  {
    title: '+ Add Chapter Item',
    key: keyId,
    children: []
  }
};

const AddChapterButton = styled(Button)`
margin-top: 20px;
`

function CourseBuilderScreen() {
  const {id: courseId} = useParams();
  const { mutate: updateCourse,isLoading:loading } = useUpdateCourse();
  const { data: courseDetails} = useGetCourseDetails(courseId +'', {
    enabled: !!courseId
  })
  const [courseTree, setCourseTree] = useState<DataNode[]>(courseDetails?.courseTree);
  const navigate = useNavigate();
  const onAddNewItem = (type: string, item: CourseNodeValueType, key?: string) => {
    let CT = [...courseTree];
    const keyId: string = JSON.stringify({
      id: uuid(),
      value: item.value,
      type: type
    });
    const newItem:DataNode = {
      title: item.title,
      key: keyId,
      children: [createChapterItemNode()],
    };

    if (key) {
      CT.forEach(item => {
        if (!item.children)
        {
          item.children = [];
        }
        item.children.forEach(i => {
          if (i.key === key)
          {
            newItem.isLeaf = true;
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

  const saveCourse = () => {
    updateCourse({
      id: courseId +'',
      data:{
        courseTree:courseTree
      }
    })
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Button icon={<ArrowLeftOutlined />} size="large" onClick={()=>navigate(-1)} type="link">
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
        <Col span={16}>
        <Card  extra={<><Button style={{marginRight:15}} icon={<UploadOutlined />}>Publish Course</Button><Button onClick={saveCourse} loading={loading} type='primary' icon={<SaveOutlined />}>Save</Button></>}>
            <Outlet />
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CourseBuilderScreen;
