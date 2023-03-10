import { Checkbox, List, Tag, Typography } from 'antd'
import { Unit, unit } from 'mathjs'

import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'
import { NavLink } from 'react-router-dom'
import { Types } from '@adewaskar/lms-common'
import styled from '@emotion/styled'
import { useUpdateCourseProgress } from '@Learner/Api/Course/queries'

const { Text } = Typography
interface CoursePlayerNavigatorItemPropsI {
  item: Types.CourseSectionItem;
  courseId: string;
  section: Types.CourseSection;
  itemIndex: number;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

const CourseListItem = styled(List.Item)`
  border-bottom: 1px solid #f0f0f0 !important;
  h4{
    margin-top: 0;
  }

  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`

function CoursePlayerNavigatorItem(props: CoursePlayerNavigatorItemPropsI) {
  let duration = props.item.metadata?.duration
  if (!duration) {
    duration = { value: 0, unit: 'second' }
  }
  // console.log(props.courseId, 'courseId')
  let durationInMin: Unit
  if (duration?.value && duration?.unit) {
    durationInMin = unit(duration?.value, duration?.unit).to('minute')
  }
  const { mutate: updateProgress } = useUpdateCourseProgress()
  return (
    <NavLink
      to={`section/${props.section._id}/item/${props.item._id}`}
      children={({ isActive }) => (
        <CourseListItem
          extra={[
            props.item.type === 'video' && durationInMin ? (
              <Tag color="blue">{durationInMin.value} min</Tag>
            ) : null,
            <CourseItemIcon type="outlined" item={props.item} />
          ]}
          isActive={isActive}
        >
          <List.Item.Meta
            avatar={
              <Checkbox
                defaultChecked={props.item.isCompleted}
                onChange={e => {
                  e.stopPropagation()
                  updateProgress({
                    courseId: props.courseId || '',
                    action: !props.item.isCompleted ? 'REMOVE' : 'ADD',
                    itemId: props.item._id
                  })
                  props.toggleItemCheck(props.item._id, !!e.target.checked)
                }}
              />
            }
            title={
              <Text style={{ marginTop: 0}} ellipsis>
                {props.itemIndex}. {props.item.title}
              </Text>
            }
            description={<span>121</span>}
          />
        </CourseListItem>
      )}
    />
  )
}

export default CoursePlayerNavigatorItem
