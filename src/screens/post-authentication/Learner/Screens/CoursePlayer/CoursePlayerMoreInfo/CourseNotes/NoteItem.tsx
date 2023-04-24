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
import { Constants, Learner, Types } from '@adewaskar/lms-common'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useState } from 'react'

import HtmlViewer from '@Components/HtmlViewer'
import { useParams } from 'react-router'

const { Text } = Typography

interface CourseNoteItemPropsI {
  course: Types.Course;
  note: {
    item: string,
    time: string,
    content: string
  };
}
const CourseNoteItem: React.FC<CourseNoteItemPropsI> = props => {
  const { sectionId, itemId } = useParams()
  const section = props.course.sections.find(s => s._id === sectionId)
  const item = section?.items.find(i => i._id === itemId)
  return (
    <Space align="start">
      <Tag color="blue">0:32</Tag>
      <Space direction="vertical">
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Text strong>{section?.title}</Text>
            <Divider type="vertical" />
            <Text>{item?.title}</Text>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} />
            <Button icon={<DeleteOutlined />} />
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
