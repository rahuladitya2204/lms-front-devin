import CourseCurriculum from './CourseCurriculum'
import { CourseDetailType } from '../../../../../types/Courses.types'
import CourseInstructor from './CourseInstructor';
import CourseOverview from './CourseOverview'
import { Tabs } from 'antd'

interface CourseDetailsPropsI {
  course: CourseDetailType;
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
        <CourseInstructor course={props.course}  />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default CourseDetails
