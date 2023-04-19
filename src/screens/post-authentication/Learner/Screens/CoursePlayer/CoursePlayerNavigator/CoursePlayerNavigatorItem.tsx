import { Button, Checkbox, Dropdown, List, Space, Tag, Typography } from 'antd'
import { Unit, unit } from 'mathjs'

import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'
import { DownloadOutlined } from '@ant-design/icons'
import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import { Types } from '@adewaskar/lms-common'
import { downloadFile } from '@User/Screens/Courses/CourseBuilder/utils'
import styled from '@emotion/styled'

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
`

function CoursePlayerNavigatorItem(props: CoursePlayerNavigatorItemPropsI) {
  console.log(props.item, 'props.item')
  let duration = props.item.metadata?.duration
  if (!duration) {
    duration = 0
  }
  let durationInMin = unit(duration, 'seconds')
    .to('minute')
    .toJSON()
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress()
  return (
    <NavLink
      to={`section/${props.section._id}/item/${props.item._id}`}
      children={({ isActive }) => (
        <CourseListItem
          // extra={[
          //   // props.item.type === 'video' && durationInMin ? (
          //   //   <Tag color="blue">{durationInMin.value} min</Tag>
          //   // ) : null,

          // ]}
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
                    action: e.target.checked ? 'ADD' : 'REMOVE',
                    itemId: props.item._id
                  })
                  props.toggleItemCheck(props.item._id, !!e.target.checked)
                }}
              />
            }
            title={
              <Text style={{ marginTop: 0 }} ellipsis>
                {props.itemIndex}. {props.item.title}
              </Text>
            }
            description={
              <Space direction="horizontal">
                {props.item.type === 'video' && durationInMin ? (
                  <Space
                    style={{
                      marginTop: 10
                    }}
                    direction="horizontal"
                    align="center"
                  >
                    <Tag
                      icon={
                        <CourseItemIcon type="outlined" item={props.item} />
                      }
                      style={{ marginRight: 0 }}
                      color="blue"
                    >
                      {Math.ceil(durationInMin.value)} min
                    </Tag>

                    {props.item.files.length ? (
                      <Dropdown.Button
                        size="small"
                        menu={{
                          items: props.item.files.map((file, index) => {
                            return {
                              key: index,
                              label: (
                                <a
                                  onClick={() => downloadFile(file.file + '')}
                                  type="primary"
                                  target="_blank"
                                  href={file.file}
                                  rel="noreferrer"
                                >
                                  {file.name} <DownloadOutlined />
                                </a>
                              )
                            }
                          })
                        }}
                        placement="bottomRight"
                      >
                        Resources
                      </Dropdown.Button>
                    ) : null}
                  </Space>
                ) : null}
              </Space>
            }
          />
        </CourseListItem>
      )}
    />
  )
}

export default CoursePlayerNavigatorItem
