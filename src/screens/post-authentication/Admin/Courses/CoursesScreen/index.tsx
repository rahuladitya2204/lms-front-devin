import { Button, Col, Row } from 'antd'

import CourseCard from './CourseCard'
import CreateCourseComponent from '../CreateCourse/CreateCourse'
import Header from '../../../Common/Dashboard/Header/Header'
import { useGetCourses } from '../../../../../queries/Courses/queries'

function CoursesScreen () {
  const { data: courses } = useGetCourses()
  return (
    <div className="site-card-wrapper">
      <Header
        title="Courses"
        extra={[
          <CreateCourseComponent>
            {' '}
            <Button type="primary">Create Course</Button>
          </CreateCourseComponent>
        ]}
      />
      <Row gutter={[16, 16]}>
        {courses.map(course => {
          return (
            <Col key={course._id} className="gutter-row" span={8}>
              <CourseCard course={course} />
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default CoursesScreen
