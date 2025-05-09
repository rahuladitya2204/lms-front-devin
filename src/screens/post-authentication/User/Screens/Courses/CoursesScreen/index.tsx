import { Button, Card, Col, Empty, List, Row, Skeleton, Spin } from 'antd'
import { Constants, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal/ActionModal'
import CourseCard from './CourseCard'
import CreateCourseComponent from '../CreateCourse/CreateCourse'
import { Fragment } from 'react'
import UserHeader from '@User/Screens/UserRoot/UserHeader'
import CoursesList from './CourseList'

function CoursesScreen() {
  const SkeletonArr = [1, 1, 1, 1, 1, 1, 1, 1].map(
    () => Constants.INITIAL_COURSE_DETAILS
  )
  const { data: courses, isFetching: loading } = User.Queries.useGetCourses()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Course</Button>}>
      <CreateCourseComponent />
    </ActionModal>
  )
  // console.log(courses, '111')
  return (
    <UserHeader title="Courses" extra={[CreateCourseCta]}>
      {/* {!courses.length && !loading ? ( */}
      <CoursesList />
      {/* ) : (
        <Card>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            description={<span>Start Creating a new course</span>}
          >
            {CreateCourseCta}
          </Empty>
        </Card>
      )} */}
    </UserHeader>
  )
}

export default CoursesScreen

const SkeletonCard = () => (
  <Card>
    <Skeleton active paragraph />
    <Skeleton.Avatar />
    <Row justify={'space-between'} gutter={[20, 20]}>
      <Col span={6}>
        <Skeleton.Button style={{ marginTop: 20 }} />
      </Col>
      <Col span={6}>
        <Skeleton.Button style={{ marginTop: 20 }} />
      </Col>
      <Col span={6}>
        <Skeleton.Button style={{ marginTop: 20 }} />
      </Col>
      <Col span={6}>
        <Skeleton.Button style={{ marginTop: 20 }} />
      </Col>
    </Row>
  </Card>
)
