import { Card, Tabs, Typography } from 'antd'

import LearnerCourseList from './CourseList'

const { Title } = Typography

const LearnerCourses: React.FC = () => {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="All Courses" key="1">
          <LearnerCourseList />
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="Wishlist" key="2">
          Content of Tab Pane 2
        </Tabs.TabPane>
        <Tabs.TabPane tab="Archived" key="3">
          Content of Tab Pane 3
        </Tabs.TabPane> */}
      </Tabs>
    </Card>
  )
}

export default LearnerCourses
