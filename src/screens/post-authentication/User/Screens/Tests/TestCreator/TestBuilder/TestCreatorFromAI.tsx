import {
  Button,
  Collapse,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Select
} from "antd";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Types, User, Enum } from "@adewaskar/lms-common";
import { useEffect, useState } from "react";
import { useModal } from "@Components/ActionModal/ModalContext";
import { AddQuestionFromBank } from "./AddQuestionFromBank";
import TopicSelect from "@Components/TopicSelect";
import { useNavigate } from "@Router/index";
import { useBuildTopicTree } from "../TestInformation/TestDetailsEditor/TestDetails";
import { QUESTION_PATTERNS } from "@User/Screens/ExtraComponents/TestQuestions/GenerateQuestionWithAI";

const { Text } = Typography;
const { Panel } = Collapse;

interface TestCreatorFromAIPropsI {
  closeModal?: Function;
  testId: string;
  sections: Types.TestSection[];
}

interface TopicItem {
  topic: string;
  count: number;
}

interface OutlineSection {
  title: string;
  questions: TopicItem[];
}

interface CreateTestCreatorFromAI {
  sections: OutlineSection[];
}

export default function TestCreatorFromAI({
  closeModal,
  sections = [],
  testId,
}: TestCreatorFromAIPropsI) {
  const [form] = Form.useForm<CreateTestCreatorFromAI>();

  const {
    data: testDetails,
    isFetching: loadingTest,
  } = User.Queries.useGetTestDetails(testId, {
    enabled: !!testId,
  });

  const { mutate: generateQuestions, isLoading: updating } =
    User.Queries.useCreateQuestionsFromAI(testId + '');

  const navigate = useNavigate();
  let { getFullTopicPath } = useBuildTopicTree(
    testDetails.topics,
    4,
    true
  );
  const onSubmit = (values: CreateTestCreatorFromAI) => {
    const formattedData = values.sections.map(section => ({
      title: section.title,
      questions: section.topics.map(topic => ({
        topic: topic.topics, // Since TopicSelect component sets the value in 'topics' field
        count: topic.questionCount,
        topicPath: getFullTopicPath(topic.topics),
        type: topic.type
      })),
      category: testDetails.category,
      language: 'eng',
      choice: 'single'
    }));

    console.log('Formatted Output:', formattedData);
    // Uncomment when ready to submit
    generateQuestions(
      formattedData,
      {
        onSuccess: (e) => {
          console.log(e, 'eee')
          navigate(`/admin/products/test/${testId}/builder`)
        },
      }
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Form.List name="sections">
        {(sectionFields, { add: addSection, remove: removeSection }) => (
          <Row>
            <Col span={24}>
              <Collapse>
                {sectionFields.map((sectionField) => (
                  <Panel
                    header={
                      <Form.Item
                        noStyle
                        shouldUpdate
                      >
                        {({ getFieldValue }) => (
                          <Text strong>
                            {getFieldValue(['sections', sectionField.name, 'title']) || `Section ${sectionField.name + 1}`}
                          </Text>
                        )}
                      </Form.Item>
                    }
                    key={sectionField.key}
                    extra={
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(sectionField.name);
                        }}
                      />
                    }
                  >
                    <Row gutter={[20, 20]}>
                      <Col span={24}>
                        <Form.Item
                          label="Section Title"
                          name={[sectionField.name, "title"]}
                          rules={[{ required: true, message: "Title is required" }]}
                        >
                          <Input placeholder="Enter section title" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.List name={[sectionField.name, "topics"]}>
                      {(formFields, { add: addTopic, remove: removeTopic }) => (
                        <>
                          {formFields.map((formField) => (
                            <Row key={formField.key} gutter={[16, 16]} align="middle">
                              <Col span={12}>
                                <TopicSelect
                                  notDisabled
                                  topicId={testDetails?.topics}
                                  name={[formField.name, "topics"]}
                                  label="Topics"
                                  rules={[{ required: true, message: "Topic is required" }]}
                                />
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  label="Questions Count"
                                  name={[formField.name, "questionCount"]}
                                  rules={[{ required: true, message: "Count required" }]}
                                >
                                  <Input type="number" min={1} />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  label="Type"
                                  name={[formField.name, "type"]}
                                // rules={[{ required: true, message: "Count required" }]}
                                >
                                  <Select options={QUESTION_PATTERNS} />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item label=" " colon={false}>
                                  <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeTopic(formField.name)}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => addTopic()}
                            icon={<PlusOutlined />}
                            block
                          >
                            Add Topic
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Panel>
                ))}
              </Collapse>

              <Button
                type="dashed"
                onClick={() => addSection()}
                icon={<PlusOutlined />}
                block
                style={{ marginTop: 16 }}
              >
                Add Section
              </Button>
            </Col>
          </Row>
        )}
      </Form.List>

      <Form.Item style={{ marginTop: 24 }}>
        <Button type="primary" loading={updating} onClick={form.submit} block>
          Generate Test
        </Button>
      </Form.Item>
    </Form>
  );
}