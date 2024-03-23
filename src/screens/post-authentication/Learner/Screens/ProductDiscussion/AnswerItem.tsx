import { Button, Col, Form, Input, Row } from 'antd'
import React, { useState } from 'react'

import TextArea from '@Components/Textarea';
import { Types } from '@invinciblezealorg/lms-common'

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
            <TextArea html value={description} onChange={setDescription} />
          </Form.Item>
          <Row>
            <Col style={{ flexDirection: 'row-reverse' }}>
              <Form.Item>
                <Button
                  onClick={() => props.onSubmit({ title, description })}
                  type="primary"
                >
                  Submit Query
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateQuestion
