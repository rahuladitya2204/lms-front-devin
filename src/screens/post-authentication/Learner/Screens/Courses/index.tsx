import { Card, Tabs } from 'antd'
import Header from '@Components/Header'
import LearnerCourseList from './CourseList'

const LearnerCourses: React.FC = () => {
  return (
    <Header title="My Courses">
      <Card>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="All Courses" key="1">
            <LearnerCourseList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Wishlist" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Archived" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Header>
  )
}

export default LearnerCourses
