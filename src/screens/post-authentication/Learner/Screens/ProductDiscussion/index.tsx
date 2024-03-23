import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Typography
} from 'antd'
import { Constants, Types } from '@invinciblezealorg/lms-common'
import React, { useState } from 'react'

import { ArrowLeftOutlined } from '@ant-design/icons'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import ProductDiscussionAnswers from './ProductDiscussionAnswers'
import ProductDiscussionQuestionsList from './ProductDiscussion'

const { Text } = Typography


interface ProductDiscussionPropsI {
  product: Types.Product;
  itemId: string;
}
const ProductDiscussion: React.FC<ProductDiscussionPropsI> = props => {
  const [question, setQuestion] = useState<Types.ProductDiscussionQuestion>(Constants.INITIAL_QUESTION_DETAILS)
  return (
    <Row>    
      <Col span={24}>
        {!question._id ?
          <ProductDiscussionQuestionsList itemId={props.itemId} selectQuestion={setQuestion} product={props.product} /> :
          <Card headStyle={{ paddingLeft: 0 ,textDecoration:'none'}}
            title={<>
              <Row>
                <Col>
                  {question._id ? <Button type='primary' icon={<ArrowLeftOutlined />} onClick={() => setQuestion(Constants.INITIAL_QUESTION_DETAILS)} style={{ marginRight: 20 }}></Button> : null}
                </Col>
                <Col>
                <Row>
                <Col span={24}>
        <Text strong>{question.title}</Text>
                </Col>
                <Col span={24}>
                <HtmlViewer content={question.description} />

                </Col>
</Row></Col>
              </Row>
              
        </>} bordered={false}>
          <Row>
            {/* <Col span={24}>
            </Col> */}
            <Col span={24}>
            <ProductDiscussionAnswers product={props.product} questionId={question._id} />

            </Col>
         </Row>
        </Card>}
    
      </Col>
    </Row>
  )
}

export default ProductDiscussion
