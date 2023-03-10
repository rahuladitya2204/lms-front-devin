import CourseCurriculum from './CourseCurriculum'
import CourseInstructor from './CourseInstructor'
import CourseOverview from './CourseOverview'
import { Tabs } from 'antd'
import { Types } from '@adewaskar/lms-common'

interface CourseDetailsPropsI {
  course: Types.Course;
}

function CourseDetails(props: CourseDetailsPropsI) {
  return (
    <Tabs style={{ fontSize: 30 }} size="middle">
      <Tabs.TabPane tab="Overview" key="overview">
        <CourseOverview course={props.course} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Curriculum" key="Curiculum">
        <CourseCurriculum course={props.course} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Instructor" key="instructor">
        <CourseInstructor course={props.course} />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default CourseDetails
