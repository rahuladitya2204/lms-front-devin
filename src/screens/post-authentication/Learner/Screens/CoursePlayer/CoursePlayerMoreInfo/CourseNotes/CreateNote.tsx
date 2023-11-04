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
import React, { useEffect, useState } from 'react'

import SunEditorComponent from '@Components/SunEditor/SunEditor'
import TextArea from '@Components/Textarea'
import { formatSeconds } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import useMessage from '@Hooks/useMessage'

const { Text } = Typography

interface CourseNotesPropsI {
  courseId: string;
  onFinish?: (r?: any) => void;
  item: string;
  selectedNote?: Types.CourseNote;
}
const CreateNote: React.FC<CourseNotesPropsI> = props => {
  const message = useMessage()
  const {
    mutate: createNote,
    isLoading: savingNote
  } = Learner.Queries.useCreateNote()
  const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { mutate: updateNote } = Learner.Queries.useUpdateNote()
  const { currentTime } = Store.usePlayer((s: any) => s.state)
  const time = formatSeconds(props.selectedNote?.time || currentTime)
  const onSave = (data: Partial<Types.CourseNote>) => {
    const note = {
      content: data.content + '',
      time: currentTime,
      item: props.item
    }
    if (props.selectedNote) {
      updateNote(
        {
          courseId: props.courseId,
          // @ts-ignore
          data: {
            content: note.content
          },
          noteId: props.selectedNote._id + ''
        },
        {
          onSuccess: r => {
            message.open({
              type: 'success',
              content: 'Note Updated'
            })
            form.resetFields()
            props.onFinish && props.onFinish(r)
          }
        }
      )
    } else {
      createNote(
        {
          courseId: props.courseId,
          data: note
        },
        {
          onSuccess: r => {
            message.open({
              type: 'success',
              content: `Note Created at ${formatSeconds(note.time)}`
            })
            form.resetFields()
            props.onFinish && props.onFinish(r)
          }
        }
      )
    }

    console.log(note, 'daa')
  }
  const [form] = Form.useForm()

  useEffect(
    () => {
      form.setFieldsValue(props.selectedNote)
    },
    [props.selectedNote]
  )
  const noteContent = Form.useWatch('content', form)
  return (
    <Form layout="vertical" onFinish={onSave} form={form}>
      <Row justify="start">
        <Col flex={1}>
          <Row>
            <Col span={24}>
              <Form.Item
                label={
                  <Text>
                    {props.selectedNote ? 'Update Note at' : 'Create a note at'}{' '}
                    {<Tag color="cyan">{time}</Tag>}
                  </Text>
                }
                name="content"
              >
                <TextArea
                  onFocus={() => playerInstance?.pause()}
                  html={{ level: 1 }}
                  height={100}
                  name="content"
                />
              </Form.Item>
            </Col>
            <Col
              span={24}
              style={{ display: 'flex', flexDirection: 'row-reverse' }}
            >
              {props.selectedNote ? (
                <Button ghost type="primary" onClick={form.submit}>
                  Update Note
                </Button>
              ) : (
                <Button
                  loading={savingNote}
                  disabled={!noteContent}
                  type="primary"
                  onClick={form.submit}
                >
                  Save Note
                </Button>
              )}
              {props.selectedNote ? (
                <Button
                  style={{ marginRight: 20 }}
                  onClick={() => {
                    form.resetFields()
                    props.onFinish && props.onFinish()
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

export default CreateNote
