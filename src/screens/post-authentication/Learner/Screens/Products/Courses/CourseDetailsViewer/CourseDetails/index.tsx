import CourseCurriculum from './CourseCurriculum'
import CourseOverview from './CourseOverview'
import CourseReviews from './CourseReviews/CourseReviews'
import Tabs from '@Components/Tabs';
import { Types } from '@invinciblezealorg/lms-common'

interface CourseDetailsPropsI {
  course: Types.Course;
}

function CourseDetails(props: CourseDetailsPropsI) {
  return (
    <Tabs navigateWithHash 
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
