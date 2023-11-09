import { Button, Col, Form, Input, Row } from 'antd'
import React, { useState } from 'react'

import { Learner } from '@adewaskar/lms-common'
import QuillEditor from '@Components/QuillEditor'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'

interface CreateAnswerPropsI {
  question: Types.ProductDiscussionQuestion;
  product: Types.Product;
}

const CreateAnswer: React.FC<CreateAnswerPropsI> = props => {
  const [description, setDescription] = useState('')
  const [form] = Form.useForm()
  const onSuccess = () => {
    form.resetFields()
  }
  const {
    mutate: createDiscussionQuestionAnswer,
    isLoading: loading
  } = Learner.Queries.useCreateDiscussionAnswer(props.product)

  const createAnswer = (q: Partial<Types.ProductDiscussionAnswer>) => {
    createDiscussionQuestionAnswer({
      questionId: props.question._id,
      data: q
    })
  }

  return (
    <Row>
      <Col span={24}>
        <Form form={form}>
          <Form.Item name="title">
            <TextArea
              html={{ level: 1 }}
              height={150}
              placeholder="Please provide a detailed summary"
              value={description}
              onChange={setDescription}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              onClick={() => {
                createAnswer({ answer: description })
              }}
              type="primary"
            >
              Submit Answer
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateAnswer
