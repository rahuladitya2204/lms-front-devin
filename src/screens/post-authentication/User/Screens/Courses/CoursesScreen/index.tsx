import { Button, Card, Col, Empty, List, Row, Spin } from 'antd'

import ActionModal from '@Components/ActionModal'
import CourseCard from './CourseCard'
import CreateCourseComponent from '../CreateCourse/CreateCourse'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'

function CoursesScreen () {
  const { data: courses, isLoading: loading } = User.Queries.useGetCourses()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Course</Button>}>
      <CreateCourseComponent />
    </ActionModal>
  )
  return (
    <Spin spinning={loading}>
      <div className="site-card-wrapper">
        <Header title="Courses" extra={[CreateCourseCta]}>
          {courses.length ? (
            <List
              grid={{ gutter: 20, column: 4, sm: 3 }}
              size="large"
              // pagination={{
              //   onChange: (page) => {
              //     console.log(page);
              //   },
              //   pageSize: 3,
              // }}
              dataSource={courses}
              renderItem={course => (
                <div style={{ padding: 30 }}>
                  <CourseCard course={course} />
                </div>
              )}
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
    </Spin>
  )
}

export default CoursesScreen
