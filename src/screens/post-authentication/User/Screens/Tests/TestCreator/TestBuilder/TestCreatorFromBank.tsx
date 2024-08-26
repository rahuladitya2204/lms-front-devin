import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tabs,
  TreeSelect,
} from "antd";
import {
  DeleteTwoTone,
  PlusCircleTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { Enum, Types, User } from "@adewaskar/lms-common";

import { TEST_TEMPLATES } from "@Components/Editor/SunEditor/constant";
import { Typography } from "@Components/Typography";
import { useEffect, useState } from "react";
import { useModal } from "@Components/ActionModal/ModalContext";
import { AddQuestionFromBank } from "./AddQuestionFromBank";

const { Text } = Typography;

interface TestCreatorFromBankPropsI {
  closeModal?: Function;
  //   onValuesChange: Function;
  testId: string;
  sections: Types.TestSection[];
}

interface OutlineSection {
  title: string;
  itemCount: number;
  optionCount: number;
  score: { correct: number; incorrect: number };
  wordLimit: number;
  questionType: string;
}

interface CreateTestCreatorFromBank {
  sections: [OutlineSection];
}

export default function TestCreatorFromBank({
  closeModal,
  sections = [],
  testId,
}: // onValuesChange
TestCreatorFromBankPropsI) {
  const [items, setItems] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const calculateTotalScore = (e: CreateTestCreatorFromBank) => {
    let total = 0;
    e.sections.forEach((section: OutlineSection) => {
      total += section.itemCount * (section?.score?.correct || 0);
    });
    setTotalScore(total);
  };
  const {
    data: testDetails,
    isFetching: loadingTest,
    isLoading: loadingTestFirst,
  } = User.Queries.useGetTestDetails(testId + "", {
    enabled: !!testId,
  });
  const [form] = Form.useForm<CreateTestCreatorFromBank>();
  useEffect(() => {
    form.setFieldsValue(
      //   "sections",
      {
        sections: sections.map((s, secIndex) => {
          return {
            ...s,
            itemCount: s.items.length,
          };
        }),
      }
    );
    setItems(sections.map((s) => s.items));
  }, [sections]);
  const { mutate: updateTestApi, isLoading: updating } =
    User.Queries.useUpdateTest();
  const onSubmit = (e: CreateTestCreatorFromBank) => {
    console.log(e, items, "eee");
    // debugger;
    // return;
    const sections = e.sections.map((section, secIndex) => {
      const sectionItems = Array.from({ length: section.itemCount }).map(
        (i, itemIndex) => {
          //   const options = Array.from({ length: section.optionCount }).map(
          //     () => ({
          //       text: null,
          //       isCorrect: false,
          //     })
          //   );

          return {
            ...items[secIndex][itemIndex],
            score: section.score,
          };
        }
      );

      return {
        title: section.title,
        items: sectionItems,
        score: section.score,
      };
    });

    updateTestApi(
      {
        id: testId || "",
        data: {
          //   @ts-ignore
          sections: sections,
        },
      },
      {
        onSuccess: (test) => {
          closeModal && closeModal();
        },
      }
    );
  };
  const { openModal } = useModal();
  return (
    <Form
      onValuesChange={calculateTotalScore}
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Row>
        <Col span={24}>
          <Form.List name="sections">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row justify={"space-between"} gutter={[10, 10]}>
                    <Col span={4}>
                      <Form.Item
                        label={`Section Title`}
                        rules={[
                          {
                            required: true,
                            message: "Please enter the answer.",
                          },
                        ]}
                        name={[field.name, "title"]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        label={`Question Count`}
                        rules={[
                          {
                            required: true,
                            message: "Please enter the question count.",
                          },
                        ]}
                        name={[field.name, "itemCount"]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    {/* <Col span={5}>
                      <TopicSelect
                        multiple
                        name={[field.name, "topics"]}
                        label="Topics"
                      />
                    </Col> */}

                    <Col span={3}>
                      <Form.Item
                        // style={{ width: 80 }}
                        label={`Correct Score`}
                        rules={[
                          {
                            required: true,
                            message: "Please enter the score.",
                          },
                        ]}
                        name={[field.name, "score", "correct"]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        // style={{ width: 80 }}
                        label={`Incorrect Score`}
                        rules={[
                          {
                            required: true,
                            message: "Please enter the score.",
                          },
                        ]}
                        name={[field.name, "score", "incorrect"]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        onClick={() => {
                          openModal(
                            <AddQuestionFromBank
                              languages={testDetails.languages}
                              onSelect={(questions: Types.TestQuestion[]) => {
                                const Items = [...items];
                                Items[parseInt(field.name)] = [...questions];
                                setItems(Items);
                              }}
                              topics={testDetails.topics}
                              items={items[field.name]}
                              multiple
                            />,
                            {
                              keyboard: false,
                              width: 900,
                              title: "Select Question from Bank",
                            }
                          );
                        }}
                        size="small"
                        type="primary"
                        shape="default"
                        icon={<SearchOutlined />}
                      ></Button>
                    </Col>
                  </Row>
                ))}
                <Button onClick={(e) => add()} icon={<PlusCircleTwoTone />}>
                  Add Option
                </Button>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      {totalScore ? (
        <>
          <Divider />{" "}
          <Row justify="end">
            <Col>
              <Text strong>Total Score: {totalScore}</Text>
            </Col>
          </Row>
        </>
      ) : null}
      <Button
        style={{ marginTop: 50 }}
        loading={updating}
        type="primary"
        onClick={form.submit}
      >
        Generate Test
      </Button>
    </Form>
  );
}
