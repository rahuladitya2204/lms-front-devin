import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Modal,
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
const { confirm } = Modal
interface CourseNoteItemPropsI {
  course: Types.Course;
  note: Types.CourseNote;
}
const CourseNoteItem: React.FC<CourseNoteItemPropsI> = props => {
  const { mutate: deleteNoteApi } = Learner.Queries.useDeleteNote()
  const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { sectionId, itemId } = useParams()
  const section = props.course.sections.find(s => s._id === sectionId)
  const item = section?.items.find(i => i._id === itemId)
  const time = formatSeconds(props.note.time)

  const deleteNote = () => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this note`,
      onOk() {
        deleteNoteApi(
          {
            courseId: props.course._id,
            noteId: props.note._id + ''
          },
          {
            onSuccess: () => {}
          }
        )
      },
      okText: 'Delete'
    })
  }

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
            <Button
              shape="round"
              onClick={deleteNote}
              icon={<DeleteOutlined />}
            />
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
