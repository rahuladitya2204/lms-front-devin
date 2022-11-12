import QuillEditor from '@Components/QuillEditor'
import {
  useCreateDiscussionQuestion,
  useCreateDiscussionQuestionAnswer
} from '@Learner/Api/queries'
import { Course, CourseQuestion, CourseQuestionAnswer } from '@Types/Courses.types'
import { Button, Col, Form, Input, Row } from 'antd'

import React, { useState } from 'react'

interface CreateAnswerPropsI {
  question: CourseQuestion;
}

const CreateAnswer: React.FC<CreateAnswerPropsI> = props => {
  const [description, setDescription] = useState('')
  const [form] = Form.useForm()
  const onSuccess = () => {
    console.log('success')
    form.resetFields()
  }
  const {
    mutate: createDiscussionQuestionAnswer,
    isLoading: loading
  } = useCreateDiscussionQuestionAnswer(onSuccess)
  const createAnswer = (q: Partial<CourseQuestionAnswer>) => {
    console.log(q)
    createDiscussionQuestionAnswer({
      courseId: props.question.course,
      questionId: props.question._id,
      data: q
    })
  }

  return (
    <Row>
      <Col span={24}>
        <Form form={form}>
          <Form.Item name="title">
            <QuillEditor
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
              Submit Query
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateAnswer
