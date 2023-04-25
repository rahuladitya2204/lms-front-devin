import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import SunEditorComponent from '@Components/SunEditor/SunEditor'
import { formatSeconds } from '@User/Screens/Courses/CourseBuilder/utils'

const { Text } = Typography

interface CourseNotesPropsI {
  courseId: string;
  item: string;
}
const CreateNote: React.FC<CourseNotesPropsI> = props => {
  const { mutate: createNote } = Learner.Queries.useCreateNote()
  const { currentTime } = Store.usePlayer((s: any) => s.state)
  const onSave = (data: Partial<Types.CourseNote>) => {
    const note = {
      content: data.content + '',
      time: currentTime,
      item: props.item
    }
    createNote(
      {
        courseId: props.courseId,
        data: note
      },
      {
        onSuccess: () => {
          form.resetFields()
        }
      }
    )
    console.log(note, 'daa')
  }
  const time = formatSeconds(currentTime)
  const [form] = Form.useForm()
  return (
    <Form layout="vertical" onFinish={onSave} form={form}>
      <Space align="start">
        <Tag>{time}</Tag>

        <Space direction="vertical" align="end">
          <Row>
            <Col span={24}>
              <Form.Item label={<Text>Create a note</Text>} name="content">
                <SunEditorComponent height={100} name="content" />
              </Form.Item>
            </Col>
          </Row>

          <Space align="end" style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={form.submit}>
              Save Note
            </Button>
          </Space>
        </Space>
      </Space>
    </Form>
  )
}

export default CreateNote
