import { Button, Col, Form, Input, Row, Select } from 'antd'
import { Enum, Types, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import InputTags from '@Components/InputTags/InputTags'
import TopicSelect from '@Components/TopicSelect'
import { useParams, useSearchParams } from '@Router/index'
import SelectLanguage from '@Components/SelectLanguage'
import SelectProductCategory from '@Components/SelectProductCategory'
import { useBuildTopicTree } from '@User/Screens/Tests/TestCreator/TestInformation/TestDetailsEditor/TestDetails'
import TextArea from '@Components/Textarea'

const DIFFICULTY_LEVELS = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Difficult', value: 'difficult' }
]

const INITIAL_VALUES = {
  difficultyLevel: 'medium',
  taxonomyLevel: 'analyze',
  choice: Enum.TestQuestionType.SINGLE,
  type: 'factual'
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
  const { itemId, id: testId } = useParams();
  const { data: test } = User.Queries.useGetTestDetails(testId + "");
  const [params] = useSearchParams();
  const [keywords, setKeywords] = useState<string[]>([])
  const [form] = Form.useForm<Types.TestQuestionMeta>()
  const {
    mutate: generateQuestion,
    isLoading: loading
  } = User.Queries.useGenerateQuestionWithAI()

  let { getFullTopicPath } = useBuildTopicTree(
    test.topics,
    4,
    true
  );
  useEffect(() => {
    form.setFieldValue(['category'], test.category)
    form.setFieldValue(['language'], test.languages[0])
  }, [test])

  const ONSUBMIT = (data: Types.QuestionPrompt) => {
    const language = params.get('test-question')
    generateQuestion(
      {
        data: {
          ...data,
          category: test.category,
          language,
          topicPath: `${getFullTopicPath(data.topic)}`
        }
      },
      {
        onSuccess: d => {
          d.language = language
          d.topic = data.topic;
          onSubmit && onSubmit(d)
          closeModal && closeModal()
        }
      }
    )
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data])
  return (
    <Form
      form={form}
      initialValues={INITIAL_VALUES}
      layout="vertical"
      onFinish={ONSUBMIT}
    >
      {/* <Form.Item
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
      </Form.Item> */}
      <TopicSelect fullPath
        level={4}
        label="Topics"
        notDisabled
        required
        topicId={test.topics}
        name="topic"
      />
      {/* <Form.Item label="Keywords">
        <InputTags name='keywords'
          ctaText="Enter Keyword"
          // @ts-ignore
          options={keywords}
        // onChange={setKeywords}
        />
      </Form.Item> */}
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form.Item label="Difficulty Level" name="difficultyLevel">
            <Select options={DIFFICULTY_LEVELS} />
          </Form.Item>
        </Col>
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
          <SelectLanguage languages={test.languages} name={['language']} />
        </Col>
        <Col span={12}>
          <Form.Item label="Question Type" name="type">
            <Select
              options={[
                {
                  label: 'Factual',
                  value: 'factual'
                },
                {
                  label: 'Statement Based',
                  value: 'statement-based'
                },
                {
                  label: 'Match the following',
                  value: 'match-the-following'
                },
                {
                  label: 'Pair Validation',
                  value: 'pair-validation'
                },
                {
                  label: 'Assertion/Reason',
                  value: 'assertion-reason'
                },
                {
                  label: 'Chronological',
                  value: 'chronological-order'
                }
              ]}
            />
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item label='Guidelines' name='guidelines'>
            <TextArea name={['guidelines']} />
          </Form.Item>
        </Col> */}
      </Row>
      <Row justify={'end'}>
        <Col> <Button loading={loading} type="primary" onClick={form.submit}>
          Generate Question
        </Button></Col>
      </Row>
    </Form>
  )
}


function useComputeHierarchy(topicIds) {
  const { data: allTopics } = User.Queries.useGetTopics();

  const topicMap = allTopics.reduce((map, topic) => {
    map[topic._id.toString()] = topic;
    return map;
  }, {});

  function buildHierarchyPath(startTopicId: string): string {
    const path = [];
    let currentId = startTopicId;
    const visitedIds = new Set();

    while (currentId && !visitedIds.has(currentId)) {
      visitedIds.add(currentId);
      const currentTopic = topicMap[currentId];

      if (!currentTopic) break;
      path.push(currentTopic.title?.eng || "[Unknown Topic]");
      currentId = currentTopic.parentId?.toString();
    }

    return path.reverse().join(" -> ");
  }

  const hierarchyMap = {};
  for (const topicId of topicIds) {
    hierarchyMap[topicId.toString()] = buildHierarchyPath(topicId.toString());
  }

  return hierarchyMap;
}