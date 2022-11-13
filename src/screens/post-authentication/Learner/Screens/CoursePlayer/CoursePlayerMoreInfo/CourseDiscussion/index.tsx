import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Typography
} from 'antd'

import React, { useState } from 'react'
import { Course, CourseQuestion } from '@Types/Courses.types'

import CourseQuestionsList from './CourseQuestions'
import CourseQuestionAnswers from './CourseQuestionAnswers'
import { INITIAL_QUESTION_DETAILS } from 'constant'
const { Text } = Typography


interface CourseDiscussionPropsI {
  course: Course;
}
const CourseDiscussion: React.FC<CourseDiscussionPropsI> = props => {
  const [question, setQuestion] = useState<CourseQuestion>(INITIAL_QUESTION_DETAILS)
  console.log(question,'question')
  return (
    <Row>    
      <Col span={24}>
       
        {!question._id?<CourseQuestionsList selectQuestion={setQuestion} course={props.course} />: <Card title={<Text strong>{question.title}</Text>} extra={question._id ? [<Button onClick={() => setQuestion(INITIAL_QUESTION_DETAILS)}>Back</Button>] : []} bordered={false}>
          <div dangerouslySetInnerHTML={{__html:question.description }}></div><CourseQuestionAnswers question={question} /></Card>}
    
      </Col>
    </Row>
  )
}

export default CourseDiscussion
