import { Tabs, Typography } from 'antd'

import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import CourseOverview from '../../../../non-authenticated/CourseDetailViewer/Layout-1/CourseDetails/CourseOverview'
import { Course } from '../../../../../types/Courses.types'

interface CoursePlayerMoreInfoPropsI {
  course: Course;
}

const CoursePlayerMoreInfo: React.FC<CoursePlayerMoreInfoPropsI> = props => {
  const TAB_ITEMS = [
    {
      label: <SearchOutlined />,
      key: '1',
      children: 'Search Content'
    },
    {
      label: 'Overview',
      key: '2',
      children: <CourseOverview course={props.course} />
    },
    {
      label: 'Q & A',
      key: '3',
      children: 'Q and A'
    },
    {
      label: 'Announcements',
      key: '4',
      children: 'Tab 3'
    },
    {
      label: 'Reviews',
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
