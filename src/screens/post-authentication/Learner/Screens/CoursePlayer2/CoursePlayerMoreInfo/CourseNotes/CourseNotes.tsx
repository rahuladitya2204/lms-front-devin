import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Tag,
  Typography
} from 'antd'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'

import CourseNoteItem from './NoteItem'
import CreateNote from './CreateNote'
import { formatSeconds } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useParams } from 'react-router'

const { Text } = Typography

interface CourseNotesPropsI {
  course: Types.Course;
}
const CourseNotes: React.FC<CourseNotesPropsI> = props => {
  const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { course } = props
  const { itemId, sectionId } = useParams()
  const {
    data: { metadata: { notes } }
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: 'course',
      id: course._id + ''
    },
    {
      enabled: !!course._id
    }
  )
  console.log(playerInstance?.getCurrentTime)

  const currentItemNotes = notes.filter(note => note.item === itemId) || []
  return (
    <Row>
      <Col span={24}>
        <Card title="Notes">
          {/* <Row>
            <Col span={24}>
              <CreateNote item={itemId + ''} courseId={course._id} />
            </Col>
            {currentItemNotes.map(note => {
              return (
                <Col span={24} style={{ marginBottom: 20 }}>
                  <Divider />
                  <CourseNoteItem
                    course={course}
                    note={note}
                  />
                </Col>
              )
            })}
          </Row> */}
          <Row>
            <Col span={24}>
              <CreateNote item={itemId + ''} courseId={course._id} />
            </Col>
          </Row>
          <List
            itemLayout="horizontal"
            dataSource={currentItemNotes}
            renderItem={(note, index) => {
              return <CourseNoteItem course={course} note={note} />
            }}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default CourseNotes
