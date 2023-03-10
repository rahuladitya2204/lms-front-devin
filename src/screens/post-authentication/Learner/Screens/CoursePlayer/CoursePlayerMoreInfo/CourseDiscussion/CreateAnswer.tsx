import { Button, Col, Form, Input, Row } from 'antd'
import React, { useState } from 'react'

import QuillEditor from '@Components/QuillEditor'
import { Types } from '@adewaskar/lms-common'
import { useCreateDiscussionQuestionAnswer } from '@Learner/Api/Course/queries';

interface CreateAnswerPropsI {
  question: Types.CourseQuestion;
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
  } = useCreateDiscussionQuestionAnswer(onSuccess)

  const createAnswer = (q: Partial<Types.CourseQuestionAnswer>) => {
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
              Submit Answer
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateAnswer
