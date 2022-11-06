import { CourseDetailsType } from '../../../../../types/Courses.types'
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
        Curriculum
      </Tabs.TabPane>
      <Tabs.TabPane tab="Instructor" key="instructor">
        Instructor
      </Tabs.TabPane>
    </Tabs>
  )
}

export default CourseDetails
