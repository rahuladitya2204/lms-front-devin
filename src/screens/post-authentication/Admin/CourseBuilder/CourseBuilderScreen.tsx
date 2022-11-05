import { ArrowLeftOutlined, EditOutlined, EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import { CourseNodeValueType, CourseSectionItem } from '../../../../types/Common.types'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { useGetCourseDetails, useUpdateCourse } from '../../../../queries/Courses/CoursesQueries'

import AddItem from './AddItem'
import CourseBuilderTree from './CourseBuilderTree'
import CreateHeading from './CreateNewItem/CreateHeading'
import FileUpload from '../../../../components/FileUpload'
import styled from '@emotion/styled'
import { updateCourseTreeNode } from './utils'
import { v4 as uuid } from 'uuid';

const AddChapterButton = styled(Button)`
margin-top: 20px;
`;

function CourseBuilderScreen() {
  const {id: courseId} = useParams();
  const { mutate: updateCourse,isLoading:loading } = useUpdateCourse();
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });
  
  console.log(courseDetails, 'courseDetails');
  const [courseSections, setCourseSections] = useState<CourseSectionItem[]>([]);
  const navigate = useNavigate();
  
  const onAddNewItem = (type: string, item: CourseNodeValueType, index:number | null) => {
    let CourseSections = [...courseSections];
    const newItem: CourseSectionItem = {
      title: item.title,
      id: uuid(),
      data: item.data,
      type,
      items: [],
    };
    if (index !== null)
    {
      CourseSections[index].items.push(newItem);
    }
    else {
      CourseSections.push(newItem);
    }
      
    setCourseSections(CourseSections)
  }

  const saveCourse = () => {
    updateCourse({
      id: courseId +'',
      data:{
        courseSections: courseSections
      }
    })
  }


  useEffect(() => {
    setCourseSections(courseDetails?.courseSections)
  }, [courseDetails]);

  const updateCourseTree = (node:CourseSectionItem) => {
    const updatedTree = updateCourseTreeNode(courseSections, node);
    setCourseSections(updatedTree);
  }

  const deleteSection = (index:number) => {
    const sections = [...courseSections];
    sections.splice(index, 1);
    setCourseSections(sections);
  }

  const deleteSectionItem = (sectionIndex: number,itemIndex:number) => {
    const sections = [...courseSections];
    sections[sectionIndex].items.splice(itemIndex, 1);
    setCourseSections(sections);
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
          <Button icon={<ArrowLeftOutlined />} size="large" onClick={()=>navigate(`/admin/dashboard/courses`)} type="link">
            Back to courses
          </Button>
          <FileUpload onUpload={e => {
            console.log(e, 'Helo');
          }}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[<EyeOutlined />, <EditOutlined />]}
          />
          </FileUpload>

            <CourseBuilderTree deleteSectionItem={deleteSectionItem} deleteSection={deleteSection} onAddNewItem={onAddNewItem} courseSections={courseSections} />

          <CreateHeading onFinish={(e)=>onAddNewItem('heading',e,null)} >
          <AddChapterButton  block type="primary">
            Add New Section
          </AddChapterButton>
          </CreateHeading>
          </Card>
        </Col>
        <Col span={16}>
        <Card  extra={<><Button style={{marginRight:15}} icon={<UploadOutlined />}>Publish Course</Button><Button onClick={saveCourse} loading={loading} type='primary' icon={<SaveOutlined />}>Save</Button></>}>
            <Outlet context={[courseSections,updateCourseTree]} />
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CourseBuilderScreen;
