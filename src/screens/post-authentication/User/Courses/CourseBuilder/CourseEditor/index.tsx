import { Button, Card, Tabs } from 'antd'
import { EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { INITIAL_COURSE_DETAILS, useGetCourseDetails, useUpdateCourse } from '../../../../../../network/Courses/queries'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import { CourseDetailType } from '../../../../../../types/Courses.types'
import CourseDetailsEditor from './CourseDetailsEditor'

function CourseEditor () {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(INITIAL_COURSE_DETAILS)
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  useEffect(() => {
    setCourse(courseDetails);
   },[courseDetails])

  
  const saveCourse = () => {
    updateCourse({
      id: courseId + '',
      data: course
    })
  }

  const onCourseUpdate = (data: Partial<CourseDetailType>) => {
    console.log(data, 'data');
    setCourse({
      ...course,
      ...data
    });
  }


  return (
    <Card extra={<><Button onClick={()=>navigate('preview')} style={{marginRight:15}} icon={<EyeOutlined />}>Preview</Button><Button loading={loading} type='primary' onClick={saveCourse} icon={<UploadOutlined />}>Save Course</Button></>}>
      <Tabs
        defaultActiveKey="1"
        // onChange={onChange}
        items={[
          {
            label: `Details`,
            key: '1',
            children: <CourseDetailsEditor formData={course} onFormUpdate={onCourseUpdate} />
          },
          {
            label: `Pricing`,
            key: '2',
            children: `Content of Tab Pane 2`
          },
          {
            label: `Pages`,
            key: '3',
            children: `Content of Tab Pane 3`
          },
          {
            label: `Advanced`,
            key: '4',
            children: `Content of Tab Pane 3`
          }
        ]}
      />

      <Outlet />
    </Card>
  )
}

export default CourseEditor
