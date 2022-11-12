import {
  Avatar,
  Button,
  Card,
  Col,
  Comment,
  List,
  Row,
  Tooltip,
  Typography
} from 'antd'

import React, { useState } from 'react'
import { Course, CourseQuestion } from '@Types/Courses.types'
import CreateQuestion from './CreateQuestion'
import {
  INITIAL_COURSE_DETAILS,
  useCreateDiscussionQuestion,
  useGetCourseQuestions
} from '@Learner/Api/queries'
import { UpCircleOutlined } from '@ant-design/icons'
import CourseQuestionsList from './CourseQuestions'
import CourseQuestionAnswers from './CourseQuestionAnswers'
const { Text } = Typography

const INITIAL_QUESTION_DETAILS: CourseQuestion = {
  answers: [],
  title: '',
  course:'',
  upvotes: 0,
  description: '',
  _id: ''
};
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
