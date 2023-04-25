import { Avatar, Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import CourseNoteItem from './NoteItem'
import CreateNote from './CreateNote'
import { PlusOutlined } from '@ant-design/icons'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import { formatSeconds } from '@User/Screens/Courses/CourseBuilder/utils'
import { useParams } from 'react-router'

const { Text } = Typography

interface CourseNotesPropsI {
  course: Types.Course;
}
const CourseNotes: React.FC<CourseNotesPropsI> = props => {
  const { course } = props
  const { itemId } = useParams()
  const { data: { notes } } = Learner.Queries.useGetEnrolledCourseDetails(
    course._id + ''
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
            <Col span={24}>
              <Space direction="vertical">
                {currentItemNotes.map(note => {
                  return <CourseNoteItem course={course} note={note} />
                })}
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default CourseNotes
