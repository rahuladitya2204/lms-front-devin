import CourseCurriculum from './CourseCurriculum'
import { CourseDetailsType } from '../../../../../types/Courses.types'
import CourseInstructor from './CourseInstructor';
import CourseOverview from './CourseOverview'
import { Tabs } from 'antd'

interface CourseDetailsPropsI {
  course: CourseDetailsType;
}

function CourseDetails(props: CourseDetailsPropsI) {
  return (
    <Tabs>
      <Tabs.TabPane tab="Overview" key="overview">
        <CourseOverview course={props.course} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Curriculum" key="Curiculum">
        <CourseCurriculum course={props.course} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Instructor" key="instructor">
        <CourseInstructor />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default CourseDetails
