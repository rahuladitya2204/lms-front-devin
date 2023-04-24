import { Avatar, Button, Card, Col, Row, Typography } from 'antd'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import CourseNoteItem from './NoteItem'
import { PlusOutlined } from '@ant-design/icons'
import { formatSeconds } from '@User/Screens/Courses/CourseBuilder/utils'

const { Text } = Typography

interface CourseNotesPropsI {
  course: Types.Course;
}
const CourseNotes: React.FC<CourseNotesPropsI> = props => {
  const { currentTime } = Store.usePlayer(s => s.state)
  const { data: { notes } } = Learner.Queries.useGetEnrolledCourseDetails(
    props.course._id + ''
  )
  return (
    <Row>
      <Col span={24}>
        <Card
          title="Notes"
          extra={[
            <Button icon={<PlusOutlined />}>
              Create Note at {formatSeconds(currentTime)}
            </Button>
          ]}
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
