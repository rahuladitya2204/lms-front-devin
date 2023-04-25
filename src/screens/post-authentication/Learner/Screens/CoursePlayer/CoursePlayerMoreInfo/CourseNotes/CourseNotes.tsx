import { Card, Col, Divider, Row, Typography } from 'antd'
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
  const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { course } = props
  const { itemId } = useParams()
  const { data: { notes } } = Learner.Queries.useGetEnrolledCourseDetails(
    course._id + ''
  )
  console.log(playerInstance?.getCurrentTime)
  useEffect(
    () => {
      console.log(playerInstance, 'playerInstance')
      if (playerInstance && playerInstance?.on) {
        // playerInstance.on('timeupdate', (e: any) => {
        //   console.log(e, '11212')
        // })
      }
    },
    [playerInstance]
  )

  const currentItemNotes = notes.filter(note => note.item === itemId) || []
  return (
    <Row>
      <Col span={24}>
        <Card title="Notes">
          <Row>
            <Col span={24}>
              <CreateNote item={itemId + ''} courseId={course._id} />
            </Col>
            {currentItemNotes.map(note => {
              return (
                <Col span={24} style={{ marginBottom: 20 }}>
                  <Divider />
                  <CourseNoteItem course={course} note={note} />
                </Col>
              )
            })}
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default CourseNotes
