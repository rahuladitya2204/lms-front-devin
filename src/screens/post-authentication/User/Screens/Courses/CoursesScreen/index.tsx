import { Button, Card, Col, Empty, Row } from 'antd'

import ActionModal from '@Components/ActionModal'
import CourseCard from './CourseCard'
import CreateCourseComponent from '../CreateCourse'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'

function CoursesScreen () {
  const { data: courses } = User.Queries.useGetCourses()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Course</Button>}>
      <CreateCourseComponent />
    </ActionModal>
  )
  return (
    <div className="site-card-wrapper">
      <Header title="Courses" extra={[CreateCourseCta]}>
        {courses.length ? (
          <Row gutter={[16, 16]}>
            {courses.map(course => {
              return (
                <Col key={course._id} className="gutter-row" span={8}>
                  <CourseCard course={course} />
                </Col>
              )
            })}
          </Row>
        ) : (
          <Card>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 60 }}
              description={<span>Start Creating a new course</span>}
            >
              {CreateCourseCta}
            </Empty>
          </Card>
        )}
      </Header>
    </div>
  )
}

export default CoursesScreen
