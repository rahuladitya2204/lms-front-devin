import { Button, Card, Col, Empty, List, Row } from 'antd'

import ActionModal from '@Components/ActionModal'
import CourseCard from './CourseCard'
import CreateCourseComponent from '../CreateCourse/CreateCourse'
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
          <List
            itemLayout="vertical"
            size="large"
            // pagination={{
            //   onChange: (page) => {
            //     console.log(page);
            //   },
            //   pageSize: 3,
            // }}
            dataSource={courses}
            renderItem={course => <CourseCard course={course} />}
          />
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
