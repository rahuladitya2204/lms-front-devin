import { ArrowUpOutlined, CommentOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, List, Row, Typography } from 'antd'

import { Comment } from '@ant-design/compatible'
import CreateQuestion from './CreateQuestion'
import { Learner } from '@adewaskar/lms-common'
import React from 'react'
import { Types } from '@adewaskar/lms-common'

const { Text } = Typography

interface ProductDiscussionQuestionListPropsI {
  selectQuestion: (q: Types.ProductDiscussionQuestion) => void;
  product: Types.Product;
}

const ProductDiscussionQuestionList: React.FC<
  ProductDiscussionQuestionListPropsI
> = props => {
  const { data: questions } = Learner.Queries.useGetProductDiscussionQuestions({
    id: props.product.id,
    type: props.product.type
  })
  console.log(props.product, 'poui')

  // const upvote = () => {}

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
                      <ArrowUpOutlined /> {question.answers.length}
                    </Text>,
                    <Text strong>
                      <CommentOutlined
                        onClick={() => props.selectQuestion(question)}
                      />
                    </Text>
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
          />
        </Col>
      ) : null}

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
    </Row>
  )
}

export default ProductDiscussionQuestionList
