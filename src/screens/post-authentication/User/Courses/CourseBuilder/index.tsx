import { ArrowLeftOutlined, EditOutlined, EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Col, Image, Row } from 'antd'
import { CourseNodeValueType, CourseSectionItem } from '../../../../../types/Common.types'
import { Outlet, useNavigate, useParams } from 'react-router'
import { Fragment, useEffect, useState } from 'react'
import { useGetCourseDetails, useUpdateCourse } from '../../../../../network/Courses/queries'

import CourseBuilderTree from './CourseBuilderTree'
import CreateHeading from './CreateNewItem/CreateHeading'
import FileUpload from '../../../../../components/FileUpload'
import styled from '@emotion/styled'
import { updateCourseTreeNode } from './utils'
import { v4 as uuid } from 'uuid';
import ImageUpload from '../../../../../components/ImageUpload'

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
  const [sections, setsections] = useState<CourseSectionItem[]>([]);
  const navigate = useNavigate();
  
  const onAddNewItem = (type: string, item: CourseNodeValueType, index:number | null) => {
    let SECTIONS = [...sections];
    const ID = uuid();
    const newItem: CourseSectionItem = {
      title: item.title,
      id: ID,
      data: item.data,
      type,
      items: [],
    };
    if (index !== null)
    {
      SECTIONS[index].items.push(newItem);
    }
    else {
      SECTIONS.push(newItem);
    }
    if(type!=='heading')
    navigate(`${type}/${ID}`)
    setsections(SECTIONS)
  }

  const saveCourse = () => {
    updateCourse({
      id: courseId +'',
      data:{
        sections: sections
      }
    })
  }


  useEffect(() => {
    setsections(courseDetails?.sections)
  }, [courseDetails]);

  const updateCourseTree = (node:CourseSectionItem) => {
    const updatedTree = updateCourseTreeNode(sections, node);
    setsections(updatedTree);
  }

  const deleteSection = (index:number) => {
    const SECTIONS = [...sections];
    sections.splice(index, 1);
    setsections(SECTIONS);
  }

  const deleteSectionItem = (sectionIndex: number,itemIndex:number) => {
    const SECTIONS = [...sections];
    sections[sectionIndex].items.splice(itemIndex, 1);
    setsections(SECTIONS);
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={9}>
          <Card extra={[<Button icon={<ArrowLeftOutlined />} size="large" onClick={()=>navigate(`/user/dashboard/courses`)} type="link">
            Back to courses
          </Button>]}>
          <ImageUpload onUpload={e => {
            console.log(e, 'Helo');
          }}>
          
          </ImageUpload>

            {sections.length? <CourseBuilderTree deleteSectionItem={deleteSectionItem} deleteSection={deleteSection} onAddNewItem={onAddNewItem} sections={sections} />:null} 

          <CreateHeading onFinish={(e)=>onAddNewItem('heading',e,null)} >
          <AddChapterButton  block type="primary">
            Add New Section
          </AddChapterButton>
          </CreateHeading>
          </Card>
        </Col>
        <Col span={15}>
          <Card extra={<Fragment>
            <Button style={{ marginRight: 15 }} icon={<UploadOutlined />}>Publish Course</Button><Button onClick={saveCourse} loading={loading} type='primary' icon={<SaveOutlined />}>Save</Button>
          </Fragment>}>
            <Outlet context={[sections,updateCourseTree]} />
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CourseBuilderScreen;
