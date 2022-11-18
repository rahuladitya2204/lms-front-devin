import { Avatar, List, Tooltip, Typography } from 'antd'
import { Comment } from '@ant-design/compatible';
import React, { Fragment } from 'react'
import { CourseQuestion } from '@Types/Courses.types'
import CreateAnswer from './CreateAnswer'

const { Text } = Typography

interface CourseQuestionAnswersPropsI {
  question: CourseQuestion;
}

const CourseQuestionAnswers: React.FC<CourseQuestionAnswersPropsI> = props => {
  const question = props.question
  const answers = question.answers
  return (
    <Fragment>
      {answers.length ? (
        <List
          className="comment-list"
          header={`${answers.length} replies`}
          itemLayout="horizontal"
          dataSource={answers}
          renderItem={item => (
            <li>
              <Comment
                // actions={actions}
                author={<Text strong>Aditya Dewaskar</Text>}
                avatar={
                  <Avatar
                    src="https://joeschmoe.io/api/v1/random"
                    alt="Han Solo"
                  />
                }
                content={<div dangerouslySetInnerHTML={{__html: item.answer}}></div>}
                datetime={
                  <Tooltip title="2016-11-22 11:22:33">
                    <span>8 hours ago</span>
                  </Tooltip>
                }
              />
            </li>
          )}
        />
      ) : null}

      <CreateAnswer question={question} />
    </Fragment>
  )
}

export default CourseQuestionAnswers
