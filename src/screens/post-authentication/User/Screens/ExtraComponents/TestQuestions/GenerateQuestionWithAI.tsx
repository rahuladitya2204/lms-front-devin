import { Button, Col, Form, Input, Row, Select } from 'antd'
import { Enum, Types, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import InputTags from '@Components/InputTags/InputTags'

const DIFFICULTY_LEVELS = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Difficult', value: 'difficult' }
]

const INITIAL_VALUES = {
  difficultyLevel: 'medium',
  taxonomyLevel: 'analyze',
  choice: Enum.TestQuestionType.SINGLE,
  type: 'numerical'
}

const TAXONOMY_LEVELS = [
  { label: 'Remember', value: 'easy' },
  { label: 'Understand', value: 'medium' },
  { label: 'Apply', value: 'apply' },
  { label: 'Analyze', value: 'analyze' },
  { label: 'Evaluate', value: 'evaluate' },
  { label: 'Create', value: 'create' }
]

interface GenerateQuestionWithAIPropsI {
  submit?: (d: Types.TestQuestion) => void;
  closeModal?: Function;
  onSubmit?: Function;
  data?: Partial<Types.TestQuestionMeta>;
}

export default function GenerateQuestionWithAI({
  submit,
  onSubmit,
  data,
  closeModal
}: GenerateQuestionWithAIPropsI) {
  const [keywords, setKeywords] = useState<string[]>([])
  const [form] = Form.useForm<Types.TestQuestionMeta>()
  const {
    mutate: generateQuestion,
    isLoading: loading
  } = User.Queries.useGenerateQuestionWithAI()
  const ONSUBMIT = (data: Types.QuestionPrompt) => {
    if (onSubmit) {
       onSubmit( {
        ...data,
        // @ts-ignore
        keywords
      })
      return closeModal && closeModal()

    }
    generateQuestion(
      {
        data: {
          ...data,
          keywords
        }
      },
      {
        onSuccess: d => {
          submit&&submit(d)
          closeModal && closeModal()
        }
      }
    )
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
   },[data])

  return (
    <Form
      form={form}
      initialValues={INITIAL_VALUES}
      layout="vertical"
      onFinish={ONSUBMIT}
    >
      <Form.Item
        name="subject"
        label="Subject"
        rules={[
          {
            required: true,
            message: 'Enter a subject for this question scope'
          }
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="topic"
        label="Topic/Concept"
        rules={[
          {
            required: true,
            message: 'Enter a topic name for this question'
          }
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item label="Keywords">
        <InputTags name='keywords'
          ctaText="Enter Keyword"
          // @ts-ignore
          options={keywords}
          // onChange={setKeywords}
        />
      </Form.Item>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form.Item label="Difficulty Level" name="difficultyLevel">
            <Select options={DIFFICULTY_LEVELS} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Taxonomy Level" name="taxonomyLevel">
            <Select options={TAXONOMY_LEVELS} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form.Item label="Choice" name="choice">
            <Select
              options={[
                { label: 'Single Choice', value: Enum.TestQuestionType.SINGLE },
                { label: 'Multiple Choice', value: Enum.TestQuestionType.MULTIPLE },
                { label: 'Numeric', value: Enum.TestQuestionType.NUMERIC },
                { label: 'Subjective', value: Enum.TestQuestionType.SUBJECTIVE }
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Type" name="type">
            <Select
              options={[
                { label: 'Numerical', value: 'numerical' },
                { label: 'Non numerical', value: 'non-numerical' }
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Button loading={loading} type="primary" onClick={form.submit}>
        Generate Question
      </Button>
    </Form>
  )
}
