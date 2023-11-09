import { Button, Col, Form, Input, Row } from 'antd'
import React, { useState } from 'react'

import { Learner } from '@adewaskar/lms-common'
import QuillEditor from '@Components/QuillEditor'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'

interface CreateQuestionPropsI {
  product: Types.Product;
}

const CreateQuestion: React.FC<CreateQuestionPropsI> = props => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [form] = Form.useForm()
  // const onSuccess = () => {
  //   form.resetFields()
  // }
  const {
    mutate: createDiscussionQuestion,
    isLoading: loading
  } = Learner.Queries.useCreateDiscussionQuestion()
  const createQuestion = (q: Partial<Types.ProductDiscussionQuestion>) => {
    createDiscussionQuestion({ product: props.product, data: q })
  }

  return (
    <Row>
      <Col span={24}>
        <Form form={form}>
          <Form.Item name="title">
            <Input
              placeholder="Enter title of your query"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="description">
            <TextArea height={100}
              html={{ level: 1 }}
              placeholder="Please provide a detailed summary"
              value={description}
              onChange={setDescription}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              onClick={() => {
                createQuestion({ title, description })
              }}
              type="primary"
            >
              Submit Query
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateQuestion
