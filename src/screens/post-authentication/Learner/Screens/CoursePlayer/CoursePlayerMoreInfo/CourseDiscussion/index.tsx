import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Typography
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import CourseQuestionAnswers from './CourseQuestionAnswers'
import CourseQuestionsList from './CourseQuestions'

const { Text } = Typography


interface CourseDiscussionPropsI {
  course: Types.Course;
}
const CourseDiscussion: React.FC<CourseDiscussionPropsI> = props => {
  const [question, setQuestion] = useState<Types.CourseQuestion>(Constants.INITIAL_QUESTION_DETAILS)
  return (
    <Row>    
      <Col span={24}>
       
        {!question._id?<CourseQuestionsList selectQuestion={setQuestion} course={props.course} />: <Card title={<Text strong>{question.title}</Text>} extra={question._id ? [<Button onClick={() => setQuestion(Constants.INITIAL_QUESTION_DETAILS)}>Back</Button>] : []} bordered={false}>
          <div dangerouslySetInnerHTML={{__html:question.description }}></div><CourseQuestionAnswers courseId={props.course._id} questionId={question._id} /></Card>}
    
      </Col>
    </Row>
  )
}

export default CourseDiscussion
