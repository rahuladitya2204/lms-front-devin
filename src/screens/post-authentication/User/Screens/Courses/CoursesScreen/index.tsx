import { Button, Col, Row } from 'antd'

import CourseCard from './CourseCard'
import CreateCourseComponent from '../CreateCourse'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'

function CoursesScreen () {
  const { data: courses } = User.Queries.useGetCourses()
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
      >
        <Row gutter={[16, 16]}>
          {courses.map(course => {
            return (
              <Col key={course._id} className="gutter-row" span={8}>
                <CourseCard course={course} />
              </Col>
            )
          })}
        </Row>
      </Header>
    </div>
  )
}

export default CoursesScreen
