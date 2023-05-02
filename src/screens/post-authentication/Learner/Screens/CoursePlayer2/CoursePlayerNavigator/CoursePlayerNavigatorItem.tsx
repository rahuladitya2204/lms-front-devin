import { List, Progress, Typography, theme } from 'antd'
import { Unit, unit } from 'mathjs'
import PlayIcon from './icons/play.svg'
import PauseIcon from './icons/pause.svg'
import {
  CheckCircleFilled,
  PauseOutlined,
  PlayCircleFilled,
  PlayCircleOutlined
} from '@ant-design/icons'
import { Store, Utils } from '@adewaskar/lms-common'
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
  // const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress()
  const { progress, playerInstance, playing } = Store.usePlayer(s => s.state)
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
            <Text style={{ fontSize: 13 }} strong>
              {Utils.formatSeconds(Number(duration + ''))}
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
                  format={() => {
                    return (
                      <img
                        src={playing ? PauseIcon : PlayIcon}
                        onClick={() => {
                          if (playing) {
                            playerInstance.pause()
                          } else {
                            playerInstance?.play()
                          }
                        }}
                        style={{
                          fontSize: 30,
                          color: token.colorPrimary,
                          width: 12,
                          position: 'relative',
                          left: 1
                        }}
                      />
                    )
                  }}
                />
              ) : (
                <Icon style={{ fontSize: 28, color: IconColor }} />
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
