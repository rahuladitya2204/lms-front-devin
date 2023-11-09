import { ArrowUpOutlined, CommentOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Card, Col, List, Row, Skeleton, Typography } from 'antd'

import { Comment } from '@ant-design/compatible'
import CreateQuestion from './CreateQuestion'
import { Learner } from '@adewaskar/lms-common'
import React from 'react'
import { Types } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const { Text } = Typography

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

  return (
    <Row>
            <Col span={24}>
        <Card>
          <Comment
            avatar={
              <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
            }
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

export default ProductDiscussionList
	