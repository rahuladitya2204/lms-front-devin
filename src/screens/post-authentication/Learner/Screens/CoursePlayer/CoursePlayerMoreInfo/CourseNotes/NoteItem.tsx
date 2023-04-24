import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import React, { useState } from 'react'

import HtmlViewer from '@Components/HtmlViewer'
import { formatSeconds } from '@User/Screens/Courses/CourseBuilder/utils'
import { useParams } from 'react-router'

const { Text } = Typography

interface CourseNoteItemPropsI {
  course: Types.Course;
  note: Types.CourseNote;
}
const CourseNoteItem: React.FC<CourseNoteItemPropsI> = props => {
  const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { sectionId, itemId } = useParams()
  const section = props.course.sections.find(s => s._id === sectionId)
  const item = section?.items.find(i => i._id === itemId)
  const time = formatSeconds(props.note.time)
  return (
    <Space align="start">
      <Tag color="blue">{time}</Tag>
      <Space direction="vertical">
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Text strong>{section?.title}</Text>
            <Divider type="vertical" />
            <Text>{item?.title}</Text>
          </Space>
          <Space>
            <Button
              shape="round"
              onClick={() => {
                if (playerInstance) {
                  playerInstance.currentTime(props.note.time)
                  playerInstance.play()
                }
              }}
              icon={<PlayCircleOutlined />}
            />
            <Button shape="round" icon={<EditOutlined />} />
            <Button shape="round" icon={<DeleteOutlined />} />
          </Space>
        </Space>
        <Space direction="vertical">
          <HtmlViewer content={props.note.content} />
        </Space>
      </Space>
    </Space>
  )
}

export default CourseNoteItem
