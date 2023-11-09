import { ArrowUpOutlined, CommentOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Card, Col, List, Row, Skeleton, Typography, theme } from 'antd'
import { Learner, Store, Utils } from '@adewaskar/lms-common'

import { Comment } from '@ant-design/compatible'
import CreateQuestion from './CreateQuestion'
import React from 'react'
import { Types } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const { Text } = Typography
const { useToken } = theme

interface ProductDiscussionListPropsI {
  selectQuestion: (q: Types.ProductDiscussionQuestion) => void;
  product: Types.Product;
}

const ProductDiscussionList: React.FC<ProductDiscussionListPropsI> = props => {
  const {
    data: questions,
    isFetching: loadingQuestions,
    isLoading: loadingFirstQuestions
  } = Learner.Queries.useGetProductDiscussionQuestions(props.product)

  const upvote = () => {}
  const { token } = useToken()
  const appUser = Store.useAuthentication(u => u.user);
  return (
    <Row>
            <Col span={24}>
        <Card>
          <Comment
            avatar={
              <Avatar style={{ backgroundColor: token.colorPrimary }}>
              {Utils.getFirstLettersOfName(appUser.name)}
            </Avatar>            }
            content={<CreateQuestion product={props.product} />}
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
            dataSource={questions.sort((a,b)=>b.date-a.date)}
              renderItem={question => {
                const user = question.user as unknown as Types.Learner;
              return (
                <List.Item
                  key={question._id}
                  actions={[
                    <Text type='secondary'>{dayjs(question.date).fromNow() }</Text>,
                    <Badge count={question.upvotes }>
                    <Button icon={<ArrowUpOutlined />}>
                   </Button>
                      </Badge>,
                    <Badge count={question.answers.length }>
                      <Button type='primary' shape='circle' icon={<CommentOutlined

                      />} onClick={() => props.selectQuestion(question)}>
  </Button>
                    </Badge>
                  ]}
                >
                  <List.Item.Meta
                        avatar={
                          <Avatar style={{ backgroundColor: (user._id===appUser._id)?token.colorPrimary:token.colorTextSecondary }}>
                              {Utils.getFirstLettersOfName(user.name)}
                          </Avatar>
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

export default ProductDiscussionList
	