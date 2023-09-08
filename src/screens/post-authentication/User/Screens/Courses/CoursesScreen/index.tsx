import { Button, Card, Col, Empty, List, Row, Skeleton, Spin } from 'antd'

import ActionModal from '@Components/ActionModal'
import CourseCard from './CourseCard'
import CreateCourseComponent from '../CreateCourse/CreateCourse'
import { Fragment } from 'react'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'

function CoursesScreen() {
  const SkeletonArr = [1,1,1,1,1,1,1,1]
  const { data: courses, isLoading: loading } = User.Queries.useGetCourses()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Course</Button>}>
      <CreateCourseComponent />
    </ActionModal>
  )
  console.log(SkeletonArr,'111')
  return (
    <Header title="Courses" extra={[CreateCourseCta]}>
      {loading ? <>
        <Row gutter={[20,100]}>
         {SkeletonArr.map(()=> <Col span={6}>
           <Card>
           <Skeleton active paragraph />
           <Skeleton.Avatar />
             <Row justify={'space-between'} gutter={[20,20]}>
               <Col span={6}>
                 <Skeleton.Button style={{ marginTop: 20 }} /></Col>
                 <Col span={6}>
                 <Skeleton.Button style={{ marginTop: 20 }} /></Col>
                 <Col span={6}>
                 <Skeleton.Button style={{ marginTop: 20 }} /></Col>
                 <Col span={6}>
               <Skeleton.Button style={{ marginTop: 20 }} /></Col>
           </Row>
</Card>        </Col>)} 
        </Row></> : <Fragment>
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
      </Fragment>}
    </Header>
  )
}

export default CoursesScreen
