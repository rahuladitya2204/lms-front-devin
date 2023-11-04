import { ArrowUpOutlined, CommentOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, List, Row, Skeleton, Typography } from 'antd'

import { Comment } from '@ant-design/compatible'
import CreateQuestion from './CreateQuestion'
import { Learner } from '@adewaskar/lms-common'
import React from 'react'
import { Types } from '@adewaskar/lms-common'

const { Text } = Typography

interface CourseQuestionsListPropsI {
  selectQuestion: (q: Types.CourseQuestion) => void;
  course: Types.Course;
}

const CourseQuestionsList: React.FC<CourseQuestionsListPropsI> = props => {
  const {
    data: questions,
    isFetching: loadingQuestions,
    isLoading: loadingFirstQuestions
  } = Learner.Queries.useGetCourseQuestions(props.course._id)

  const upvote = () => {}

  return (
    <Row>
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
      {questions.length ? (
        <Col span={24}>
          {loadingFirstQuestions ? <>
            <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} />
          </> : <List
            loading={loadingQuestions}
            className="comment-list"
            header={`${questions?.length} Comments`}
              itemLayout="horizontal"
              // @ts-ignore
            dataSource={questions.sort((a,b)=>a.date-b.date)}
            renderItem={question => {
              return (
                <List.Item
                  key={question._id}
                  actions={[
                    <Button icon={<ArrowUpOutlined /> }> Upvote <Text style={{marginLeft:10}} strong>
                     {question.answers.length}
                  </Text></Button>,
                    <Button type='primary' icon={<CommentOutlined
                      
                    />} onClick={() => props.selectQuestion(question)}>
                      Comment
                      <Text strong>
                 
                  </Text></Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar src={'https://joeschmoe.io/api/v1/random'} />
                    }
                    title={
                      <Text ellipsis strong>
                        {question.title}
                      </Text>
                    }
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
          />}
        </Col>
      ) : null}
    </Row>
  )
}

export default CourseQuestionsList
