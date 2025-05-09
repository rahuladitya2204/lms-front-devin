import { Avatar, List, Skeleton, Tooltip, theme } from 'antd'
import { Learner, Store, Types, Utils } from '@adewaskar/lms-common'
import React, { Fragment } from 'react'

import { Comment } from '@ant-design/compatible'
import CreateAnswer from './CreateAnswer'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'

const { Text } = Typography
const { useToken } = theme

interface ProductDiscussionQuestionAnswersPropsI {
  questionId: string;
  product: Types.Product
}

const ProductDiscussionQuestionAnswers: React.FC<ProductDiscussionQuestionAnswersPropsI> = props => {
  const { token } = useToken()
  const { data: question,isLoading:loadingFirstQuestion,isFetching:loadingQuestion } = Learner.Queries.useGetProductDiscussionQuestionDetails(
    props.product,
    props.questionId
  )
  const appUser = Store.useAuthentication(s => s.user);
  const answers = question.answers
  return (
    <Fragment>
    <CreateAnswer product={props.product} question={question} />

{loadingFirstQuestion?<>
    <Skeleton avatar paragraph={{ rows: 1 }} />
    <Skeleton avatar paragraph={{ rows: 1 }} />
    <Skeleton avatar paragraph={{ rows: 1 }} />
  </>:  <List loading={loadingQuestion} locale={{emptyText:"No Replies"}}
  className="comment-list"
  header={answers.length?`${answers.length} replies`:null}
  itemLayout="horizontal"
  // @ts-ignore
  dataSource={answers.sort((a,b)=>a.date-b.date)}
          renderItem={item => {
            const user = item.user as unknown as Types.Learner;
    return  <li>
    <Comment
      // actions={actions}
      author={<Text strong>{user.name}</Text>}
      avatar={
        <Avatar style={{ backgroundColor: (user._id===appUser._id)?token.colorPrimary:token.colorTextSecondary }}>
                            {Utils.getFirstLettersOfName(user.name)}
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
  }}
/>}

</Fragment>
  )
}

export default ProductDiscussionQuestionAnswers
