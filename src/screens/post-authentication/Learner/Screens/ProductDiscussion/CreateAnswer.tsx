import { Button, Col, Form, Input, Row, message } from 'antd'

import { Learner } from '@adewaskar/lms-common'
import React from 'react'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'

interface CreateAnswerPropsI {
  question: Types.ProductDiscussionQuestion;
  product: Types.Product;
}

const CreateAnswer: React.FC<CreateAnswerPropsI> = props => {
  const [form] = Form.useForm()
  const {
    mutate: createDiscussionQuestionAnswer,
    isLoading: loading
  } = Learner.Queries.useCreateDiscussionAnswer(props.product)

  const createAnswer = (q: Partial<Types.ProductDiscussionAnswer>) => {
    createDiscussionQuestionAnswer(
      {
        questionId: props.question._id,
        data: q
      },
      {
        onSuccess: () => {
          form.resetFields()
          message.success('Answer submitted successfully')
        },
        onError: error => {
          // @ts-ignore
          message.error('Error submitting answer: ' + error.message)
        }
      }
    )
  }

  return (
    <Row>
      <Col span={24}>
        <Form form={form} onFinish={createAnswer}>
          <Form.Item
            name="answer"
            rules={[
              {
                required: true,
                message: 'Please provide a detailed answer'
              },
              {
                min: 10,
                message: 'Answer must be at least 10 characters'
              }
            ]}
          >
            <TextArea
              placeholder="Please provide a detailed summary"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
          <Row>
            <Col span={24} style={{ flexDirection: 'row-reverse' }}>
              <Form.Item>
                <Button
                  loading={loading}
                  onClick={() => form.submit()}
                  type="primary"
                >
                  Submit Answer
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateAnswer
