import { ArrowLeftOutlined, EditOutlined, EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import { CourseNodeValueType, CourseTreeTypeNode } from '../../../../types/Common.types'
import { Outlet, useNavigate, useParams } from 'react-router'
import { convertToDataNode, createChapterItemNode, updateCourseTreeNode } from './utils'
import { useEffect, useState } from 'react'
import { useGetCourseDetails, useUpdateCourse } from '../../../../queries/Courses/CoursesQueries'

import AddItem from './AddItem'
import CourseBuilderTree from './CourseBuilderTree'
import styled from '@emotion/styled'
import { v4 as uuid } from 'uuid';

const AddChapterButton = styled(Button)`
margin-top: 20px;
`;

const TreeHoldingCard = styled(Card)`
padding: 15px;
padding-left:10px;
div.ant-card-body{
  padding: 0;
}
`

function CourseBuilderScreen() {
  const {id: courseId} = useParams();
  const { mutate: updateCourse,isLoading:loading } = useUpdateCourse();
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });

  useEffect(() => {
    setCourseTree(courseDetails?.courseTree)
   },[courseDetails])

  const [courseTree, setCourseTree] = useState<CourseTreeTypeNode[]>([]);
  const navigate = useNavigate();
  
  const onAddNewItem = (type: string, item: CourseNodeValueType, id?: string) => {
    let CT = [...courseTree];
    const newItem: CourseTreeTypeNode = {
      title: item.title,
      id: uuid(),
      data: item.data,
      type,
      children: [createChapterItemNode()],
    };

    if (id) {
      newItem.children = [];
      CT.forEach(item => {
        if (!item.children)
        {
          item.children = [];
        }
        item.children.forEach(i => {
          if (i.id === id)
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

  const saveCourse = () => {
    updateCourse({
      id: courseId +'',
      data:{
        courseTree: courseTree
      }
    })
  }

  const updateCourseTree = (node:CourseTreeTypeNode) => {
    const updatedTree = updateCourseTreeNode(courseTree, node);
    console.log(updatedTree, node, 'updatedTree');
    setCourseTree(updatedTree);
  }


  const CourseTreeDataNode = convertToDataNode(courseTree);
  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Button icon={<ArrowLeftOutlined />} size="large" onClick={()=>navigate(`/app/dashboard/courses`)} type="link">
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

          <TreeHoldingCard>
            <CourseBuilderTree onAddNewItem={onAddNewItem} courseTree={CourseTreeDataNode} />
          </TreeHoldingCard>

          <AddItem onAddNewItem={onAddNewItem} >
          <AddChapterButton  block type="primary">
      Add New Chapter
    </AddChapterButton>
          </AddItem>
        </Col>
        <Col span={16}>
        <Card  extra={<><Button style={{marginRight:15}} icon={<UploadOutlined />}>Publish Course</Button><Button onClick={saveCourse} loading={loading} type='primary' icon={<SaveOutlined />}>Save</Button></>}>
            <Outlet context={[courseTree,updateCourseTree]} />
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CourseBuilderScreen;
