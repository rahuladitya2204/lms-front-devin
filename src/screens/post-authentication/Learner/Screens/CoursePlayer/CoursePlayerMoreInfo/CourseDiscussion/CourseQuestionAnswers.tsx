import { Avatar, List, Skeleton, Tooltip, Typography, theme } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import React, { Fragment } from 'react'

import { Comment } from '@ant-design/compatible'
import CreateAnswer from './CreateAnswer'
import HtmlViewer from '@Components/HtmlViewer'
import dayjs from 'dayjs'

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
    isFetching: loadingQuestion,
    isLoading: loadingFirstQuestion
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
            <CreateAnswer question={question} />

      {loadingFirstQuestion?<>
            <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} />
          </>:  <List loading={loadingQuestion}
          className="comment-list"
          header={`${answers.length} replies`}
          itemLayout="horizontal"
          // @ts-ignore
          dataSource={answers.sort((a,b)=>a.date-b.date)}
          renderItem={item => (
            <li>
              <Comment
                // actions={actions}
                author={<Text strong>{user.name}</Text>}
                avatar={
                  <Avatar style={{ backgroundColor: token.colorPrimary }}>
                    {name}
                  </Avatar>
                }
                content={<HtmlViewer content={item.answer} />}
                datetime={
                  <Tooltip title={dayjs(item.date).format('LLL')}>
                    <span>{dayjs(item.date).fromNow() }</span>
                  </Tooltip>
                }
              />
            </li>
          )}
        />}

    </Fragment>
  )
}

export default CourseQuestionAnswers
