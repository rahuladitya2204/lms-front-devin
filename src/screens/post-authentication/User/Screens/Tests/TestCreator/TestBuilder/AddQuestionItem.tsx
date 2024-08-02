import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  Tree,
  TreeSelect,
  message,
} from "@Lib/index";
import { Constants, Enum, Types, User, Utils } from "@adewaskar/lms-common";
import {
  DeleteTwoTone,
  DownOutlined,
  PlusCircleTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import AppImage from "@Components/Image";
import EnterLatexText from "./EnterLatexText";
import GenerateAIItemDetails from "./GenerateAIItemDetails";
import InputTags from "@Components/InputTags/InputTags";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import MediaUpload from "@Components/MediaUpload";
import Tabs from "@Components/Tabs";
import { Text } from "@Components/Typography/Typography";
import TextArea from "@Components/Textarea";
import { Typography } from "@Components/Typography";
import UploadVideo from "@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoPopup/UploadVideo";
import { useParams } from "@Router/index";
import useTestBuilderUI from "./hooks/useTestBuilder";
import useTestNavigation from "@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation";
import { useTestStore } from "./hooks/useTestStore";
import useUpdateTestForm from "./hooks/useUpdateTest";
import { htmlToText } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { AddQuestionFromBank } from "./AddQuestionFromBank";

const { Title } = Typography;

const { confirm } = Modal;

export const QUESTION_TYPES = [
  { value: Enum.TestQuestionType.SINGLE, label: "Single Choice" },
  { value: Enum.TestQuestionType.MULTIPLE, label: "Multiple Choice" },
  { value: Enum.TestQuestionType.NUMERIC, label: "Numeric" },
  { value: Enum.TestQuestionType.SUBJECTIVE, label: "Subjective" },
  {
    value: Enum.TestQuestionType.FILL_IN_THE_BLANK,
    label: "Fill in the blank",
  },
];

export const QUESTION_DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "difficult", label: "Difficult" },
];

interface CreateQuestionFormPropsI {
  submit?: (d: Types.TestQuestion) => void;
  data?: Types.TestQuestion;
  closeModal?: Function;
  onFormChange?: (d: Partial<Types.TestQuestion>) => void;
}

const AddQuestion: React.FC<CreateQuestionFormPropsI> = (props) => {
  const [form] = Form.useForm();

  const [enterHtml, setEnterHtml] = useState(false);
  const { itemId, id: testId } = useParams();
  const { onFormChange, updateItem } = useUpdateTestForm(itemId + "");
  const item = useTestStore((s) => s.currentQuestion);
  const { data: test } = User.Queries.useGetTestDetails(testId + "");
  const criterias = Form.useWatch("criterias", form);

  const isTestEnded = test.status === Enum.TestStatus.ENDED;

  useEffect(() => {
    const i = {
      ...item,
    };
    if (!item.topic) {
      // @ts-ignore
      i.topic = null;
    }
    form.setFieldsValue(i);
  }, [item]);

  const submit = (e: Types.TestQuestion) => {
    props.submit && props.submit({ ...e });
    form.resetFields();
    props.closeModal && props.closeModal();
  };
  const questionType = Form.useWatch("type", form);
  // const { updateNavigator } = useTestBuilderUI();
  const OptionSelectedFormControl =
    questionType === Enum.TestQuestionType.SINGLE ? Radio : Checkbox;
  const { data: file } = User.Queries.useGetFileDetails(
    item?.solution?.video + "",
    {
      enabled: !!item?.solution?.video,
    }
  );

  const jobId = file?.metadata?.video?.jobId;
  const {
    data: { status, progress },
  } = User.Queries.useGetTranscodeVideoStatus(jobId, {
    retry: true,
    enabled: !!jobId,
    retryDelay: 4000,
  });
  const { mutate: deleteSectionItemApi, isLoading: deletingSectionItem } =
    User.Queries.useDeleteTestSectionItem();
  const DeleteSectionItem = () => {
    confirm({
      title: "Are you sure?",
      content: `You want to delete this section item`,
      onOk() {
        deleteSectionItemApi({
          data: { testId: testId + "", itemId: itemId + "" },
        });
      },
      okText: "Delete",
    });
  };
  const fileId = file.encoded || file._id;
  const options = Form.useWatch("options", form) || [];
  const { mutate: solveQuestion, isLoading: solvingQuestion } =
    User.Queries.useSolveQuestion();
  // const topics=Form.useWatch(['topics'],form);
  useEffect(() => {
    onFormChange({ criterias });
  }, [criterias]);
  const prefixKey = `tests/${testId}/${itemId}`;
  const fillInTheBlanks = Form.useWatch("fillInTheBlanks", form);
  const { data: treeData, isLoading: loadingTopicTree } =
    User.Queries.useGetTopicTree(test.topics, 2);
  const { mutateAsync: translateQuestion, isLoading: translatingQuestion } =
    User.Queries.useTranslateQuestion();
  const langs = test.languages.filter(
    (language) =>
      !htmlToText(form.getFieldValue(["title", "text", language]) || "")
  );
  // console.log(treeData, "treeData");
  const getFormComponent = (language: string) => (
    <Form
      name="test"
      onFinish={submit}
      initialValues={item}
      onValuesChange={(changedValues, allValues) =>
        onFormChange({
          ...allValues,
          ...(criterias || {}),
        })
      }
      form={form}
      layout="vertical"
    >
      <Row gutter={[10, 30]}>
        {langs.length ? (
          <Col span={24}>
            <Button
              loading={translatingQuestion}
              onClick={() => {
                const promises = langs.map((language) => {
                  const O = form.getFieldValue(["title", "text"]);
                  const lng = Object.keys(O).filter((key) =>
                    htmlToText(O[key])
                  )[0];
                  console.log(lng, "lng");
                  const body = {
                    title: form.getFieldValue(["title", "text", lng]),
                    options: options.map((i) => i.text[lng]),
                    language: Constants.LANGUAGES.find(
                      (o) => o.value === language
                    )?.label,
                  };
                  return translateQuestion(body);
                });
                Promise.all(promises).then((data) => {
                  console.log(data, "huhuh");
                  data.forEach((tr, index) => {
                    form.setFieldValue(
                      ["title", "text", langs[index]],
                      tr.title
                    );
                    tr.options.forEach((opt, ind) => {
                      form.setFieldValue(
                        ["options", ind, "text", langs[index]],
                        opt
                      );
                    });
                  });
                });
              }}
            >
              Translate to{" "}
              {langs
                .map(
                  (l) => Constants.LANGUAGES.find((o) => o.value === l)?.label
                )
                .join(", ")}
            </Button>
          </Col>
        ) : null}
        <Col span={24}>
          <Form.Item
            name={["title", "text", language]}
            label="Title"
            required
            rules={[
              {
                required: true,
                message: "Enter questions's title",
              },
            ]}
          >
            {/* @ts-ignore */}
            <TextArea
              modifyCta
              uploadPrefixKey={prefixKey}
              html={enterHtml ? false : { level: 3 }}
              readonly={isTestEnded}
              readOnly={item?.isAiGenerated}
              height={250}
              placeholder="Enter the question title"
            />
          </Form.Item>
          <Row gutter={[20, 20]}>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item label="Question Type" name={"type"}>
                <Select
                  disabled={isTestEnded}
                  style={{ width: "100%" }}
                  options={QUESTION_TYPES}
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item
                name={["score", "correct"]}
                label="Correct Answer Score"
                required
                rules={[
                  {
                    required: true,
                    message: "Enter the correct score for this question",
                  },
                ]}
              >
                <Input
                  readOnly={isTestEnded}
                  placeholder="Enter the score for this question"
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item
                name={["score", "incorrect"]}
                label="Incorrect Answer Score"
                required
                rules={[
                  {
                    required: true,
                    message: "Enter the incorrect score for this question",
                  },
                ]}
              >
                <Input
                  readOnly={isTestEnded}
                  placeholder="Enter the score for this question"
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item label="Difficulty Level" name={"difficultyLevel"}>
                <Select
                  style={{ width: "100%" }}
                  options={QUESTION_DIFFICULTY_LEVELS}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Topic" name="topic">
                <TreeSelect
                  loading={loadingTopicTree}
                  treeData={treeData}
                  // onExpand={onExpand}
                  // expandedKeys={expandedKeys}
                  // defaultExpandAll
                  // showLine
                  // switcherIcon={<DownOutlined />}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Tags" name="tags">
                <InputTags name="tags" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            {questionType === "subjective" ? (
              <Col span={12}>
                <Form.Item label="Word Limit" name={"wordLimit"}>
                  <Input type="number" />
                </Form.Item>
              </Col>
            ) : null}
            {questionType === Enum.TestQuestionType.NUMERIC ||
            questionType === Enum.TestQuestionType.SINGLE ||
            questionType === Enum.TestQuestionType.MULTIPLE ? (
              <Col span={24}>
                <Card style={{ marginBottom: 20 }} title="Answers">
                  {questionType === Enum.TestQuestionType.NUMERIC ? (
                    <Form.Item
                      label="Correct Numeric Answer"
                      name={["answer", "numeric"]}
                    >
                      <Input type="number" />
                    </Form.Item>
                  ) : null}
                  {questionType === Enum.TestQuestionType.SINGLE ||
                  questionType === Enum.TestQuestionType.MULTIPLE ? (
                    <Form.List name="options">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }, index) => {
                            const currentOption =
                              options[index] ||
                              Constants.INITIAL_TEST_QUESTION_OPTION;
                            // console.log(currentOption,'currentOption')
                            return (
                              <Row justify={"space-between"} align={"middle"}>
                                <Col
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Row align={"middle"}>
                                    <Col>
                                      <Text strong>
                                        {String.fromCharCode(65 + index)}
                                      </Text>
                                    </Col>
                                    <Col>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "isCorrect"]}
                                        style={{ marginBottom: 0 }}
                                        valuePropName="checked"
                                      >
                                        <OptionSelectedFormControl
                                          checked={!!currentOption?.isCorrect}
                                          value={false}
                                          // value={index} // Assigning value to OptionSelectedFormControl
                                          // checked={!!currentOption.isCorrect} // Calculating checked status
                                          disabled={!!item.isAiGenerated}
                                          onClick={(e) => {
                                            const opts = [...options];
                                            // @ts-ignore
                                            if (e.target.checked) {
                                              if (
                                                questionType ===
                                                Enum.TestQuestionType.SINGLE
                                              ) {
                                                opts.forEach((o) => {
                                                  o.isCorrect = false;
                                                });
                                              }
                                              opts[index].isCorrect = true;
                                            } else {
                                              opts[index].isCorrect = false;
                                            }

                                            form.setFieldsValue({
                                              options: opts,
                                            });
                                            // onFormChange
                                            // setCorrectOptions(options);
                                          }}
                                          style={{ marginLeft: 20 }}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col style={{ width: "80%" }}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter the answer.",
                                      },
                                    ]}
                                    {...restField}
                                    name={[name, "text", language]}
                                  >
                                    <TextArea
                                      modifyCta
                                      uploadPrefixKey={prefixKey}
                                      height={150}
                                      html={enterHtml ? false : { level: 3 }}
                                      readOnly={isTestEnded}
                                      placeholder={`Answer ${index + 1}`}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col>
                                  <Button
                                    onClick={(e) => {
                                      confirm({
                                        title: "Are you sure?",
                                        content: `You want to delete this option`,
                                        onOk() {
                                          remove(index);
                                        },
                                        okText: "Delete Option",
                                      });
                                    }}
                                    icon={
                                      <DeleteTwoTone
                                        style={{ marginLeft: 10, fontSize: 15 }}
                                      />
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Col>
                              </Row>
                            );
                          })}

                          <Button
                            onClick={(e) => add()}
                            icon={<PlusCircleTwoTone />}
                          >
                            Add Option
                          </Button>
                        </>
                      )}
                    </Form.List>
                  ) : null}
                  {/* </OptionSelectedFormControl.Group> */}
                </Card>
              </Col>
            ) : null}
          </Row>
        </Col>
        {questionType === Enum.TestQuestionType.FILL_IN_THE_BLANK && (
          <Col span={24}>
            <Card
              title="Fill in the Blanks"
              extra={
                <Row gutter={[10, 10]}>
                  <Col>
                    <Form.Item
                      style={{ margin: 0, width: 150 }}
                      name={["fillInTheBlanks", "type"]}
                    >
                      <Select
                        options={[
                          { label: "Paragraph", value: "paragraph" },
                          { label: "List", value: "list" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    {" "}
                    <Form.Item
                      style={{ margin: 0, width: 40 }}
                      name={["fillInTheBlanks", "wordLimit"]}
                    >
                      <Input placeholder="Word Limit" />
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Form.List name={["fillInTheBlanks", "blanks"]}>
                {(fields, { add, remove }) => (
                  <>
                    <Row gutter={[10, 10]} align="middle">
                      {fields.map(
                        ({ key, name, fieldKey, ...restField }, index) => (
                          <Col
                            key={key}
                            span={fillInTheBlanks?.type === "list" ? 24 : ""}
                          >
                            <Row gutter={[10, 10]}>
                              <Col>
                                <Form.Item {...restField} name={[name, "text"]}>
                                  <Input placeholder="Text or blank" />
                                </Form.Item>
                              </Col>
                              <Col>
                                <Form.Item
                                  {...restField}
                                  name={[name, "isBlank"]}
                                  valuePropName="checked"
                                >
                                  <Checkbox />
                                </Form.Item>
                              </Col>
                              <Col>
                                <PlusCircleTwoTone
                                  onClick={() => add({}, index + 1)}
                                  style={{ margin: "0 8px" }}
                                />
                                {fields.length > 1 ? (
                                  <DeleteTwoTone onClick={() => remove(name)} />
                                ) : null}
                              </Col>
                            </Row>
                          </Col>
                        )
                      )}
                    </Row>
                    {fields.length === 0 && (
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusCircleTwoTone />}
                      >
                        Add Blank
                      </Button>
                    )}
                  </>
                )}
              </Form.List>
            </Card>
          </Col>
        )}
        {questionType === Enum.TestQuestionType.SUBJECTIVE && (
          <Col span={24}>
            <Card
              title="Scoring Criteria"
              extra={[
                <GenerateAIItemDetails
                  onFinish={(e) => console.log(e, "eee")}
                  label="Generate Criteria using solution"
                  field="criterias"
                />,
                <Tag style={{ marginLeft: 20 }} color="orange-inverse">
                  Total Score: {item.score.correct}
                </Tag>,
              ]}
            >
              {/* {totalCriteriaScore !== item.score.correct ?
          <Alert style={{marginBottom:20}} type='error' message='Criteria scores must always add up to be equal to the total score' /> : null} */}
              <Form.List name="criterias">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} align="middle" gutter={10}>
                        <Col>
                          <Form.Item {...restField} name={[name, "image"]}>
                            {/* @ts-ignore */}
                            <MediaUpload
                              name={[name, "image"]}
                              uploadType="image"
                              compress={{ quality: 0.9 }}
                              // cropper
                              // width="100%"
                              height="100px"
                              aspect={16 / 9}
                              renderItem={() => (
                                <AppImage
                                  width={100}
                                  height={100}
                                  preview={criterias && criterias[index]?.image}
                                  src={(criterias && criterias[index])?.image}
                                />
                              )}
                              onUpload={(file) => {
                                form.setFieldValue(
                                  ["criterias", name, "image"],
                                  file.url
                                );
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col flex="1">
                          <Form.Item
                            {...restField}
                            name={[name, "criteria"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter the criteria",
                              },
                            ]}
                          >
                            <TextArea
                              uploadPrefixKey={prefixKey}
                              height={200}
                              placeholder="Enter scoring criteria"
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item
                            {...restField}
                            style={{ width: 100 }}
                            name={[name, "score"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter the score",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              placeholder="Score"
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <DeleteTwoTone
                            onClick={() => {
                              confirm({
                                title: "Are you sure?",
                                content: "You want to delete this criterion",
                                onOk() {
                                  remove(name);
                                },
                                okText: "Delete",
                              });
                            }}
                            style={{ fontSize: "24px", color: "#ff4d4f" }}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusCircleTwoTone />}
                    >
                      Add Criterion
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card
            title="Solution Text"
            extra={[
              <Button
                size="small"
                loading={solvingQuestion}
                onClick={() => {
                  const body = {
                    title: htmlToText(
                      form.getFieldValue(["title", "text", language])
                    ),
                    options: options.map((i) => htmlToText(i.text[language])),
                    language: Constants.LANGUAGES.find(
                      (l) => l.value === language
                    )?.label,
                  };
                  console.log(body, "popop");
                  solveQuestion(body, {
                    onSuccess: (d) => {
                      form.setFieldValue(["solution", "html", language], d);
                    },
                  });
                }}
              >
                Solve Question
              </Button>,
            ]}
          >
            <Form.Item name={["solution", "html", language]} required>
              <TextArea
                modifyCta
                uploadPrefixKey={prefixKey}
                height={350}
                html={{ level: 3 }}
                // value={form.getFieldValue(['solution', 'html',language])}
                // onChange={(e: string) => form.setFieldsValue({ solution: { html: e } })}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            style={{ marginTop: 20 }}
            title="Solution Video"
            extra={[
              <ActionModal
                cta={
                  <Button icon={<UploadOutlined />}>
                    {file._id ? "Replace video" : "Upload Solution Video"}
                  </Button>
                }
              >
                <UploadVideo
                  prefixKey={`test/${testId}/${itemId}/solution/video/index`}
                  item={item}
                  onUpload={(item) => {
                    // console.log(item, 'item')
                    // @ts-ignore
                    updateItem({
                      solution: {
                        video: item.file + "",
                      },
                    });
                  }}
                />
              </ActionModal>,
            ]}
          >
            {status === "PROGRESSING" ? (
              <>
                <Title level={3} style={{ marginTop: 0 }}>
                  {" "}
                  Processing Video...
                </Title>
                <Progress
                  style={{ marginBottom: 20 }}
                  percent={progress}
                  strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                />
              </>
            ) : null}
            {file._id ? (
              <MediaPlayer fileId={fileId} />
            ) : (
              <Empty description="No Video Uploaded" />
            )}
          </Card>
        </Col>
      </Row>
    </Form>
  );
  return (
    <Spin spinning={false}>
      {/* <Divider/> */}
      <Card>
        <Tabs
          tabKey="test-question"
          type="card"
          defaultActiveKey={test.languages[0]}
          tabBarExtraContent={{
            right: (
              <Space>
                <ActionModal
                  title="Add Question from Bank"
                  width={800}
                  cta={
                    <Button
                      size="small"
                      loading={deletingSectionItem}
                      type="primary"
                    >
                      Add Question
                    </Button>
                  }
                >
                  <AddQuestionFromBank
                    languages={test.languages}
                    topics={test.topics}
                    onSelect={(question) => {
                      form.setFieldsValue(question);
                    }}
                  />
                </ActionModal>

                <Button
                  size="small"
                  loading={deletingSectionItem}
                  type="primary"
                  danger
                  onClick={DeleteSectionItem}
                >
                  Delete Question
                </Button>
              </Space>
            ),
          }}
          items={Constants.LANGUAGES.filter((t) =>
            test.languages.includes(t.value)
          ).map((language) => {
            return {
              label: language.label,
              key: language.value,
              children: getFormComponent(language.value),
            };
          })}
        />
      </Card>
    </Spin>
  );
};

const AddQuestionMemoed = React.memo(AddQuestion);

export default AddQuestionMemoed;
