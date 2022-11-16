import { Checkbox, List, Tag, Typography } from 'antd'

import { NavLink } from 'react-router-dom'
import { Unit, unit } from 'mathjs'
import styled from '@emotion/styled'
import { CourseSection, CourseSectionItem } from '@Types/Courses.types'
import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'

const { Text } = Typography
interface CoursePlayerCollapsibleItemPropsI {
  item: CourseSectionItem;
  section: CourseSection;
  itemIndex: number;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

const CourseListItem = styled(List.Item)`
  border-bottom: 1px solid #f0f0f0 !important;

  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`

function CoursePlayerCollapsibleItem(props: CoursePlayerCollapsibleItemPropsI) {
  let duration = props.item.metadata?.duration
  if (!duration) {
    duration = { value: 0, unit: 'second' }
  }

  let durationInMin: Unit
  if (duration?.value && duration?.unit) {
    durationInMin = unit(duration?.value, duration?.unit).to('minute')
  }

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
                // defaultChecked={props.item.checked}
                onChange={e =>
                  props.toggleItemCheck(props.item._id, !!e.target.checked)
                }
              />
            }
            title={
              <Text ellipsis>
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

export default CoursePlayerCollapsibleItem
