import { Avatar, List, Skeleton, Tooltip, Typography, theme } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import React, { Fragment } from 'react'

import { Comment } from '@ant-design/compatible'
import CreateAnswer from './CreateAnswer'
import HtmlViewer from '@Components/HtmlViewer'

const { Text } = Typography
const { useToken } = theme

interface CourseQuestionAnswersPropsI {
  questionId: string;
  courseId: string;
}

const CourseQuestionAnswers: React.FC<CourseQuestionAnswersPropsI> = props => {
  const { token } = useToken()
  const {
    data: question,
    isFetching: loadingQuestion
  } = Learner.Queries.useGetCourseQuestionDetails(
    props.courseId,
    props.questionId
  )
  const user = Store.useAuthentication(s => s.user)
  console.log(user, 'ussss')
  const name = (user.name + '')
    .split(' ')
    .map(n => n[0] && n[0].toUpperCase())
    .join('')

  const answers = question.answers
  return (
    <Fragment>
      {loadingQuestion?<>
            <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} />
          </>:  <List loading={loadingQuestion}
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
                  <Avatar style={{ backgroundColor: token.colorPrimary }}>
                    {name}
                  </Avatar>
                }
                content={<HtmlViewer content={item.answer} />}
                datetime={
                  <Tooltip title="2016-11-22 11:22:33">
                    <span>8 hours ago</span>
                  </Tooltip>
                }
              />
            </li>
          )}
        />}

      <CreateAnswer question={question} />
    </Fragment>
  )
}

export default CourseQuestionAnswers
