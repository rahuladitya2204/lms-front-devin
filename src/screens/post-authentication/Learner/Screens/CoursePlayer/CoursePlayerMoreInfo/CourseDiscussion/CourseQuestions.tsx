import {
  Avatar,
  Card,
  Col,
  List,
  Row,
  Typography
} from 'antd'
import { Comment } from '@ant-design/compatible';
import React from 'react'
import { Course, CourseQuestion } from '@Types/Courses.types'

import {
  ArrowUpOutlined,
  CommentOutlined,

} from '@ant-design/icons'
import { useGetCourseQuestions } from '@Learner/Api/Course/queries'
import CreateQuestion from './CreateQuestion'

const { Text } = Typography

interface CourseQuestionsListPropsI {
  selectQuestion: (q: CourseQuestion) => void;
  course: Course;
}

const CourseQuestionsList: React.FC<CourseQuestionsListPropsI> = props => {
  const { data: questions } = useGetCourseQuestions(props.course._id)

  const upvote = () => {}

  return (
    <Row>
      {questions.length ? (
        <Col span={24}>
          <List
            className="comment-list"
            header={`${questions?.length} Comments`}
            itemLayout="horizontal"
            dataSource={questions}
            renderItem={question => {
              return (
                <List.Item
                  key={question._id}
                  actions={[
                    <Text strong>
                      <ArrowUpOutlined /> 12
                    </Text>,
                    <Text strong>
                      <CommentOutlined
                        onClick={() => props.selectQuestion(question)}
                      />
                    </Text>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={'https://joeschmoe.io/api/v1/random'} />}
                    title={<Text ellipsis strong>{question.title}</Text>}
                    description={
                      <Text ellipsis>
                        {' '}
                        <div
                          dangerouslySetInnerHTML={{ __html: question.title }}
                        />
                      </Text>
                    }
                  />
                </List.Item>
              )
            }}
          />
        </Col>
      ) : null}

      <Col span={24}>
        <Card>
          <Comment
            avatar={
              <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
            }
            content={<CreateQuestion course={props.course} />}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default CourseQuestionsList
