import { Checkbox, List, Tag } from 'antd'

import { NavLink } from 'react-router-dom'

import styled from '@emotion/styled'
import { CourseSection, CourseSectionItem } from '@Types/Courses.types'
import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'

interface CoursePlayerCollapsibleItemPropsI {
  item: CourseSectionItem;
  section: CourseSection;
  itemIndex: number;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

const CourseListItem = styled(List.Item)`
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`

function CoursePlayerCollapsibleItem(props: CoursePlayerCollapsibleItemPropsI) {
  return (
    <NavLink
      to={`section/${props.section.id}/item/${props.item.id}`}
      children={({ isActive }) => (
        <CourseListItem
          extra={[
            <Tag color="blue">12 min</Tag>,
            <CourseItemIcon type="outlined" item={props.item} />
          ]}
          isActive={isActive}
        >
          <List.Item.Meta
            avatar={
              <Checkbox
                // defaultChecked={props.item.checked}
                onChange={e =>
                  props.toggleItemCheck(props.item.id, !!e.target.checked)
                }
              />
            }
            title={
              <a href="https://ant.design">
                {props.itemIndex}. {props.item.title}
              </a>
            }
            // description={
            //   <Typography.Text
            //     style={{
            //       color: 'grey',
            //       fontSize: 14,
            //       marginTop: '5px',
            //       display: 'block'
            //     }}
            //   />
            // }
          />
        </CourseListItem>
      )}
    />
  )
}

export default CoursePlayerCollapsibleItem
