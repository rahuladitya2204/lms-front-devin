import { Avatar, Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import CourseNoteItem from './NoteItem'
import CreateNote from './CreateNote'
import { PlusOutlined } from '@ant-design/icons'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import { formatSeconds } from '@User/Screens/Courses/CourseBuilder/utils'

const { Text } = Typography

interface CourseNotesPropsI {
  course: Types.Course;
}
const CourseNotes: React.FC<CourseNotesPropsI> = props => {
  const { course } = props
  const { data: { notes } } = Learner.Queries.useGetEnrolledCourseDetails(
    course._id + ''
  )
  return (
    <Row>
      <Col span={24}>
        <Card title="Notes">
          <CreateNote courseId={course._id} />
          <Space direction="vertical">
            {notes.map(note => {
              return <CourseNoteItem course={course} note={note} />
            })}
          </Space>
        </Card>
      </Col>
    </Row>
  )
}

export default CourseNotes
