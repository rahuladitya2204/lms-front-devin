import { Tabs, Typography } from 'antd'

import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import CourseOverview from '@Learner/Screens/Courses/CourseDetailsViewer/CourseDetails/CourseOverview'
import CourseDiscussion from './CourseDiscussion'
import { Course } from '@Types/Courses.types'

const { Text } = Typography;
interface CoursePlayerMoreInfoPropsI {
  course: Course;
}

const CoursePlayerMoreInfo: React.FC<CoursePlayerMoreInfoPropsI> = props => {
  const TAB_ITEMS = [
    // {
    //   label: <SearchOutlined />,
    //   key: '1',
    //   children: 'Search Content'
    // },
    {
      label: <Text strong>Overview</Text>,
      key: '2',
      children: <CourseOverview hidePreview course={props.course} />
    },
    {
      label: <Text strong>Course Discussion</Text>,
      key: '3',
      children: <CourseDiscussion course={props.course} />
    },
    {
      label: <Text strong>Announcements</Text>,
      key: '4',
      children: 'Tab 3'
    },
    {
      label: <Text strong>Reviews</Text>,
      key: '5',
      children: 'Tab 3'
    },
    {
      label: 'Learning Tools',
      key: '6',
      children: 'Tab 3'
    }
  ]
  return <Tabs defaultActiveKey="1" items={TAB_ITEMS} />
}

export default CoursePlayerMoreInfo
