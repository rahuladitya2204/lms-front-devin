import { Avatar, Button, Col, Comment, Form, List, Row, Tabs } from 'antd'

import React from 'react'
import { Course } from '@Types/Courses.types'
import TextArea from 'antd/lib/input/TextArea'

interface CourseDiscussionPropsI {
  course: Course;
}

const CourseDiscussion: React.FC<CourseDiscussionPropsI> = props => {
    const comments = props.course.comments;
  return (
    <Row>
      <Col span={24}>
        {/* <List
          dataSource={comments}
          header={`${comments.length} ${
            comments.length > 1 ? 'replies' : 'reply'
          }`}
          itemLayout="horizontal"
          renderItem={props => <Comment {...props} />}
        /> */}
      </Col>
      <Col span={24}>
        <Comment
          avatar={
            <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
          }
          content={
            <Form>
              <Form.Item>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary">Add Comment</Button>
              </Form.Item>
            </Form>
          }
        />
      </Col>
    </Row>
  )
}

export default CourseDiscussion
