import { Avatar, List, Tooltip, Typography, theme } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import React, { Fragment } from 'react'

import { Comment } from '@ant-design/compatible'
import CreateAnswer from './CreateAnswer'

const { Text } = Typography
const { useToken } = theme

interface ProductDiscussionQuestionAnswersPropsI {
  questionId: string;
  product: Types.Product
}

const ProductDiscussionQuestionAnswers: React.FC<ProductDiscussionQuestionAnswersPropsI> = props => {
  const { token } = useToken()
  const { data: question } = Learner.Queries.useGetProductDiscussionQuestionDetails(
    props.product,
    props.questionId
  )
  const user = Store.useAuthentication(s => s.user)
  const name = (user.name + '')
    .split(' ')
    .map(n => n[0].toUpperCase())
    .join('')

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
                  <Avatar style={{ backgroundColor: token.colorPrimary }}>
                    {name}
                  </Avatar>
                }
                content={
                  <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                }
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

      <CreateAnswer product={props.product} question={question} />
    </Fragment>
  )
}

export default ProductDiscussionQuestionAnswers
