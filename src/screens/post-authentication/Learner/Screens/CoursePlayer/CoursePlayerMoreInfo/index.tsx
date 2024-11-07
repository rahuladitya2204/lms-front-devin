import CourseNotes from './CourseNotes/CourseNotes'
import ProductDiscussion from '@Learner/Screens/ProductDiscussion'
import React from 'react'
import Tabs from '@Components/Tabs'
import { Learner, Types } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'
import { useParams } from '@Router/index'
import CourseItemPYQs from './CourseItemPYQs'
// import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'

const { Text } = Typography
interface CoursePlayerMoreInfoPropsI {
  course: Types.Course;
  itemId: string;
}

const CoursePlayerMoreInfo: React.FC<CoursePlayerMoreInfoPropsI> = props => {
  const { id: courseId, itemId } = useParams();
  const {
    data: pyqs,
    isLoading: loadingNotes,
    isFetching: fetchingNotes,
  } = Learner.Queries.useGetCourseItemPYQs(
    courseId + '',
    itemId + ''
  );
  const TAB_ITEMS = [
    {
      label: `Notes`,
      key: 'notes',
      children: <CourseNotes itemId={props.itemId} course={props.course} />
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
  ]
  if (pyqs.length) {
    TAB_ITEMS.unshift({
      label: 'Previous Year Questions',
      key: 'pyqs',
      children: <CourseItemPYQs itemId={props.itemId} course={props.course} />
    })
  }
  return <Tabs defaultActiveKey="1" items={TAB_ITEMS} />
}

export default CoursePlayerMoreInfo
