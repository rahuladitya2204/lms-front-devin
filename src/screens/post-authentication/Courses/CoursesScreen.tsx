import { Button, Card, Col, Row } from 'antd'

import CourseCard from './CourseCard'
import CreateCourseComponent from './CreateCourse/CreateCourse'
import Header from '../Dashboard/Header/Header'
import { useGetCourses } from '../../../queries/Courses/CoursesHooks'

function CoursesScreen () {
  const { data: courses } = useGetCourses()
  return (
    <div className="site-card-wrapper">
      <Header title="Courses" extra={[<CreateCourseComponent />]} />
      <Row gutter={[16, 16]}>
        {courses.map(course => {
          return (
            <Col className="gutter-row" span={8}>
              <CourseCard course={course} />
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default CoursesScreen
