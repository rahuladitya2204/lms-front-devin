import CourseCurriculum from './CourseCurriculum'
import CourseInstructor from './CourseInstructor'
import CourseOverview from './CourseOverview'
import CourseReviews from './CourseReviews/CourseReviews'
import { Tabs } from 'antd'
import { Types } from '@adewaskar/lms-common'

interface CourseDetailsPropsI {
  course: Types.Course;
}

function CourseDetails(props: CourseDetailsPropsI) {
  return (
    <Tabs
      items={[
        {
          key: 'overview',
          label: `Overview`,
          children: <CourseOverview course={props.course} />
        },
        {
          key: 'curriculum',
          label: `Curriculum`,
          children: <CourseCurriculum course={props.course} />
        },
        {
          key: 'reviews',
          label: `Reviews`,
          children: <CourseReviews course={props.course} />
        }
      ]}
      style={{ fontSize: 30 }}
      size="middle"
    />
  )
}

export default CourseDetails
