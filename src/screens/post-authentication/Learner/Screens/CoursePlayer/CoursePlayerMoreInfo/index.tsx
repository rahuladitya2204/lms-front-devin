import CourseNotes from './CourseNotes/CourseNotes'
import ProductDiscussion from '@Learner/Screens/ProductDiscussion'
import React from 'react'
import Tabs from '@Components/Tabs'
import { Types } from '@adewaskar/lms-common'
import { Typography } from 'antd'
// import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'

const { Text } = Typography
interface CoursePlayerMoreInfoPropsI {
  course: Types.Course;
  itemId: string;
}

const CoursePlayerMoreInfo: React.FC<CoursePlayerMoreInfoPropsI> = props => {
  // useWatchTime(props.course._id);

  const TAB_ITEMS = [
    // {
    //   label: <Text strong>Overview</Text>,
    //   key: '2',
    //   children: <CourseOverview hidePreview course={props.course} />
    // },
    {
      label: `Notes`,
      key: 'notes',
      children: <CourseNotes course={props.course} />
    },
    {
      label: `Discussion`,
      key: 'discussion',
      children: (
        <ProductDiscussion
          itemId={props.itemId}
          product={{ type: 'course', id: props.course._id }}
        />
      )
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
