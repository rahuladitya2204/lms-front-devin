import { Button, Col, Form, Input, Row } from 'antd'
import React, { useState } from 'react'

import { Learner } from '@adewaskar/lms-common'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'

interface CreateQuestionPropsI {
  product: Types.Product;
  itemId: string;
}

const CreateQuestion: React.FC<CreateQuestionPropsI> = props => {
  const [form] = Form.useForm()
  const {
    mutate: createDiscussionQuestion,
    isLoading: loading
  } = Learner.Queries.useCreateDiscussionQuestion()
  const createQuestion = (q: Partial<Types.ProductDiscussionQuestion>) => {
    q.item = props.itemId
    createDiscussionQuestion(
      { product: props.product, data: q },
      {
        onSuccess: () => {
          form.resetFields()
        }
      }
    )
  }

  return (
    <Row>
      <Col span={24}>
        <Form form={form} onFinish={createQuestion}>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input the title of your query!'
              },
              // { min: 5, message: 'Title must be at least 5 characters' },
              { max: 100, message: 'Title cannot be more than 100 characters' }
            ]}
          >
            <Input placeholder="Enter title of your query" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                validator: (_, value) =>
                  value && value.trim()
                    ? Promise.resolve()
                    : Promise.reject(new Error('Description cannot be empty'))
              }
            ]}
          >
            <TextArea
              html={{ level: 1 }}
              height={100}
              placeholder="Please provide a detailed summary"
            />
          </Form.Item>
        </Form>
      </Col>
      <Col span={24} style={{ flexDirection: 'row-reverse' }}>
        <Row justify={'end'}>
          <Col><Form.Item>
            <Button loading={loading} onClick={form.submit} type="primary">
              Start Discussion
            </Button>
          </Form.Item></Col>
        </Row>
      </Col>
    </Row>
  )
}

export default CreateQuestion
