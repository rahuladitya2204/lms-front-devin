import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
  theme
} from 'antd'
import { Unit, unit } from 'mathjs'

import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'
import {
  CheckCircleFilled,
  DownloadOutlined,
  PauseOutlined,
  PlayCircleFilled,
  PlayCircleOutlined
} from '@ant-design/icons'
import { Learner, Store } from '@adewaskar/lms-common'
import { NavLink, useParams } from 'react-router-dom'
import { Types } from '@adewaskar/lms-common'

import styled from '@emotion/styled'
const { useToken } = theme

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
  h4 {
    margin-top: 0;
  }

  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};

  padding: 20px 10px !important;
`

function CoursePlayerNavigatorItem(props: CoursePlayerNavigatorItemPropsI) {
  const { itemId } = useParams()
  let duration = props.item.metadata?.duration
  if (!duration) {
    duration = 0
  }
  let durationInMin = unit(duration, 'seconds')
    .to('minute')
    .toJSON()
  // const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress()
  const progress = Store.usePlayer(s => s.state.progress)
  let Icon = props.item.isCompleted ? CheckCircleFilled : PlayCircleFilled
  const { token } = useToken()

  const IconColor = props.item.isCompleted
    ? token.colorSuccess
    : token.colorPrimary

  return (
    <NavLink
      to={`section/${props.section._id}/item/${props.item._id}`}
      children={({ isActive }) => (
        <CourseListItem
          extra={[
            <Text style={{ fontSize: 13 }}>
              {Math.ceil(durationInMin.value)} min
            </Text>
          ]}
          isActive={isActive}
        >
          <List.Item.Meta
            avatar={
              itemId === props.item._id ? (
                <Progress
                  type="circle"
                  percent={progress}
                  size={30}
                  format={() => <PauseOutlined />}
                />
              ) : (
                <Icon style={{ fontSize: 30, color: IconColor }} />
              )
              // <Checkbox
              //   defaultChecked={props.item.isCompleted}
              //   onChange={e => {
              //     e.stopPropagation()
              //     updateProgress({
              //       courseId: props.courseId || '',
              //       action: e.target.checked ? 'ADD' : 'REMOVE',
              //       itemId: props.item._id
              //     })
              //     props.toggleItemCheck(props.item._id, !!e.target.checked)
              //   }}
              // />
            }
            title={
              <Text style={{ marginTop: 0 }} ellipsis>
                {props.itemIndex}. {props.item.title}
              </Text>
            }
          />
        </CourseListItem>
      )}
    />
  )
}

export default CoursePlayerNavigatorItem
