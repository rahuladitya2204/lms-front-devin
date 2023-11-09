import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Typography
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import ProductDiscussionAnswers from './ProductDiscussionAnswers'
import ProductDiscussionQuestionsList from './ProductDiscussion'

const { Text } = Typography


interface ProductDiscussionPropsI {
  product: Types.Product;
}
const ProductDiscussion: React.FC<ProductDiscussionPropsI> = props => {
  const [question, setQuestion] = useState<Types.ProductDiscussionQuestion>(Constants.INITIAL_QUESTION_DETAILS)
  return (
    <Row>    
      <Col span={24}>
        {!question._id?<ProductDiscussionQuestionsList selectQuestion={setQuestion} product={props.product} />: <Card title={<Text strong>{question.title}</Text>} extra={question._id ? [<Button onClick={() => setQuestion(Constants.INITIAL_QUESTION_DETAILS)}>Back</Button>] : []} bordered={false}>
          <div dangerouslySetInnerHTML={{__html:question.description }}></div><ProductDiscussionAnswers product={props.product} questionId={question._id} /></Card>}
    
      </Col>
    </Row>
  )
}

export default ProductDiscussion
