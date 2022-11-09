import {  SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'
import {  useEffect, useState } from 'react'
import { useGetCourseDetails, useUpdateCourse } from '../../../../../network/Courses/queries'

import CourseSectionsNavigator from './CourseSectionsNavigator'
import CreateHeading from './CreateNewItem/CreateHeading'
import styled from '@emotion/styled'
import { updateCourseSectionItem } from './utils'
import { v4 as uuid } from 'uuid';
import MediaUpload from '../../../../../components/MediaUpload'
import Header from '../../Header/Header'
import { CourseSection, CourseSectionItem } from '../../../../../types/Courses.types'

const AddChapterButton = styled(Button)`
margin-top: 20px;
`;

function CourseBuilderScreen() {
  const {id: courseId} = useParams();
  const { mutate: updateCourse,isLoading:loading } = useUpdateCourse();
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });
  
  const [sections, setSections] = useState<CourseSection[]>([]);
  const navigate = useNavigate();

  const onAddSection = ({title}:Partial<CourseSection>) => {
    let SECTIONS = [...sections];
    const ID = uuid();
    const newSection: CourseSection = {
      title: title+'',
      items: [],
      description: '',
      id: ID
    };
    SECTIONS.push(newSection);
    setSections(SECTIONS)

  }
  
  const onAddNewItem = (type: string, item: Partial<CourseSectionItem>, index:number) => {
    let SECTIONS = [...sections];
    const ID = uuid();
    const newItem: CourseSectionItem = {
      title: item.title+'',
      id: ID,
      type,
      ...item
    };
    SECTIONS[index].items.push(newItem);

    navigate(`section/${SECTIONS[index].id}/${type}/${ID}`)
    setSections(SECTIONS)
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
    setSections(courseDetails?.sections)
  }, [courseDetails]);

  const updateCourseSection = (sectionId: string,item:CourseSectionItem) => {
    const updatedSections = updateCourseSectionItem(sections, sectionId, item);
    setSections(updatedSections);
  }

  const deleteSection = (index:number) => {
    const SECTIONS = [...sections];
    sections.splice(index, 1);
    setSections(SECTIONS);
    // saveCourse();
  }

  const deleteSectionItem = (sectionIndex: number,itemIndex:number) => {
    const SECTIONS = [...sections];
    sections[sectionIndex].items.splice(itemIndex, 1);
    setSections(SECTIONS);
  }
  return (
   <Header title={'Course Builder'} extra={[<Button style={{ marginRight: 15 }} icon={<UploadOutlined />}>Publish Course</Button>,<Button onClick={saveCourse} loading={loading} type='primary' icon={<SaveOutlined />}>Save</Button>]}>
      <Row gutter={[16, 16]}>
        <Col span={9}>
          <Card style={{marginBottom: 30}} >
            <Row><Col span={24}>
            <MediaUpload onUpload={e => {
          }}>
            
              </MediaUpload></Col>
              <Col span={24} style={{ marginTop: 30 }}>
                {sections.length ?
                  <CourseSectionsNavigator
                    deleteSectionItem={deleteSectionItem}
                    deleteSection={deleteSection}
                    onAddNewItem={onAddNewItem}
                    sections={sections} /> : null} 
</Col></Row>


          <CreateHeading onFinish={(e)=>onAddSection(e)} >
          <AddChapterButton  block type="primary">
            Add New Section
          </AddChapterButton>
          </CreateHeading>
          </Card>
        </Col>
        <Col span={15}>
          <Card>
            <Outlet context={[sections,updateCourseSection]} />
            </Card>
        </Col>
      </Row>
      </Header>
  )
}

export default CourseBuilderScreen;
