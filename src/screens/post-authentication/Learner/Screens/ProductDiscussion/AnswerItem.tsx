import { Button, Col, Form, Input, Row } from 'antd'
import React, { useState } from 'react'

import QuillEditor from '@Components/QuillEditor'
import { Types } from '@adewaskar/lms-common'

interface CreateQuestionPropsI {
  onSubmit: (query: Partial<Types.ProductDiscussionQuestion>) => void;
}

const CreateQuestion: React.FC<CreateQuestionPropsI> = props => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  return (
    <Row>
      <Col span={24}>
        <Form>
          <Form.Item>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <QuillEditor value={description} onChange={setDescription} />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => props.onSubmit({ title, description })}
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
