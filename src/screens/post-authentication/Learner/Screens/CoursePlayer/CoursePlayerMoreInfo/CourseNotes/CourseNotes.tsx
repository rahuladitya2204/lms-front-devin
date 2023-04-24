import { Avatar, Button, Card, Col, Row, Typography } from 'antd'
import { Constants, Learner, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import CourseNoteItem from './NoteItem'
import { PlusOutlined } from '@ant-design/icons'

const { Text } = Typography

interface CourseNotesPropsI {
  course: Types.Course;
}
const CourseNotes: React.FC<CourseNotesPropsI> = props => {
  const { data: { notes } } = Learner.Queries.useGetEnrolledCourseDetails(
    props.course._id + ''
  )
  console.log(notes, 'mpmpm')
  return (
    <Row>
      <Col span={24}>
        <Card
          title="Notes"
          extra={[<Button icon={<PlusOutlined />}>Create Note</Button>]}
        >
          <CourseNoteItem
            course={props.course}
            note={{ item: '', content: '<p>HLLLLL</p>', time: '156' }}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default CourseNotes
