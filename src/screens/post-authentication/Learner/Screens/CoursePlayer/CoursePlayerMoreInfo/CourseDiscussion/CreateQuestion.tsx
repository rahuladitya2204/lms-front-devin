import { Button, Col, Form, Input, Row, message } from 'antd'
import React, { useState } from 'react'

import { Learner } from '@adewaskar/lms-common'
import QuillEditor from '@Components/QuillEditor'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'

interface CreateQuestionPropsI {
  course: Types.Course;
}

const CreateQuestion: React.FC<CreateQuestionPropsI> = props => {
  const [form] = Form.useForm()

  const {
    mutate: createDiscussionQuestion,
    isLoading: loading
  } = Learner.Queries.useCreateDiscussionQuestion(() => {})

  const createQuestion = (values: { title: string, description: string }) => {
    console.log(values, 'clvlvlvlvl')
    const question = {
      title: values.title,
      description: values.description
    }
    createDiscussionQuestion(
      { id: props.course._id, data: question },
      {
        onSuccess: () => {
          form.resetFields()
          message.success('Query submitted successfully')
        },
        onError: () => {
          message.error('There was an error submitting your query')
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
              { min: 5, message: 'Title must be at least 5 characters' },
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
              // html={{ level: 1 }}
              height={100}
              placeholder="Please provide a detailed summary"
            />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} onClick={form.submit} type="primary">
              Submit Query
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateQuestion
