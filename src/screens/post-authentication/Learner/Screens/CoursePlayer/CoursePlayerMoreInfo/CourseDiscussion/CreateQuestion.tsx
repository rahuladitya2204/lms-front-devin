import QuillEditor from '@Components/QuillEditor'
import { useCreateDiscussionQuestion } from '@Learner/Api/queries'
import { Course, CourseQuestion } from '@Types/Courses.types'
import { Button, Col, Form, Input, Row } from 'antd'

import React, { useState } from 'react'

interface CreateQuestionPropsI {
  course: Course;
}

const CreateQuestion: React.FC<CreateQuestionPropsI> = props => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [form] = Form.useForm()
  const onSuccess = () => {
    console.log('success')
    form.resetFields()
  }
  const {
    mutate: createDiscussionQuestion,
    isLoading: loading
  } = useCreateDiscussionQuestion(onSuccess)
  const createQuestion = (q: Partial<CourseQuestion>) => {
    console.log(q)
    createDiscussionQuestion({ id: props.course._id, data: q })
  }

  return (
    <Row>
      <Col span={24}>
        <Form form={form}>
          <Form.Item name="title">
            <Input placeholder='Enter title of your query' value={title} onChange={e => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item name="description">
            <QuillEditor placeholder='Please provide a detailed summary'  value={description} onChange={setDescription} />
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
