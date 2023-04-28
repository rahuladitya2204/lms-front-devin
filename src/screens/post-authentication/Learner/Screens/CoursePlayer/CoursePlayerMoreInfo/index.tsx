import { Tabs, Typography } from 'antd'

import CourseDiscussion from './CourseDiscussion'
import CourseNotes from './CourseNotes/CourseNotes'
import CourseOverview from '@Learner/Screens/Courses/CourseDetailsViewer/CourseDetails/CourseOverview'
import React from 'react'
import { Types } from '@adewaskar/lms-common'

const { Text } = Typography
interface CoursePlayerMoreInfoPropsI {
  course: Types.Course;
}

const CoursePlayerMoreInfo: React.FC<CoursePlayerMoreInfoPropsI> = props => {
  const TAB_ITEMS = [
    // {
    //   label: <Text strong>Overview</Text>,
    //   key: '2',
    //   children: <CourseOverview hidePreview course={props.course} />
    // },
    {
      label: <Text strong>Notes</Text>,
      key: '212',
      children: <CourseNotes course={props.course} />
    },
    {
      label: <Text strong>Course Discussion</Text>,
      key: '3',
      children: <CourseDiscussion course={props.course} />
    }
    // {
    //   label: <Text strong>Announcements</Text>,
    //   key: '4',
    //   children: 'Tab 3'
    // },
    // {
    //   label: <Text strong>Reviews</Text>,
    //   key: '5',
    //   children: 'Tab 3'
    // },
    // {
    //   label: 'Learning Tools',
    //   key: '6',
    //   children: 'Tab 3'
    // }
  ]
  return <Tabs defaultActiveKey="1" items={TAB_ITEMS} />
}

export default CoursePlayerMoreInfo
