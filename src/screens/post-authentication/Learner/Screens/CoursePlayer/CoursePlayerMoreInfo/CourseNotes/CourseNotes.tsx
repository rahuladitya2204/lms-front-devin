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

import React, { useEffect, useState } from 'react'

import CourseNoteItem from './NoteItem'
import CreateNote from './CreateNote'
import { useParams } from 'react-router'

const { Text } = Typography

interface CourseNotesPropsI {
  course: Types.Course;
}
const CourseNotes: React.FC<CourseNotesPropsI> = props => {
  // const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { course } = props
  const { itemId } = useParams()
  const { data: notes } = Learner.Queries.useGetCourseNotes(
    course._id
    // {
    //   enabled: !!course._id
    // }
  )
  console.log(notes, 'notes')
  const currentItemNotes = notes.filter(note => note.item === itemId) || []
  return (
    <Row>
      <Col span={24}>
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
        <Divider />
        <List
          locale={{ emptyText: 'No Notes Added' }}
          itemLayout="horizontal"
          dataSource={currentItemNotes}
          renderItem={(note, index) => {
            return <CourseNoteItem course={course} note={note} />
          }}
        />
      </Col>
    </Row>
  )
}

export default CourseNotes
