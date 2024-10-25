"use client";
import {
  BackwardOutlined,
  CheckCircleTwoTone,
  CheckOutlined,
  CloseCircleTwoTone,
  CloseOutlined,
  DeleteOutlined,
  FlagOutlined,
  ForwardOutlined,
  GlobalOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  InfoCircleTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Image,
  Input,
  List,
  Progress,
  Radio,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Tooltip,
  theme,
} from "@Lib/index";
import { Constants, Enum, Learner, Types } from "@adewaskar/lms-common";
import { Fragment, useEffect, useMemo, useState } from "react";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { NavLink } from "@Router/index";
import { Paragraph } from "@Components/Typography/Typography";
import { TestAnswerTag } from "../TestResult/Table/TestResultTable";
import TestItemSkeleton from "./TestItemSkeleton";
import TestPlayerFiles from "../TestPlayer/TestPlayerItem/TestPlayerFiles";
import TextArea from "@Components/Textarea";
import { Typography } from "@Components/Typography";
import { htmlToText } from "html-to-text";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useParams } from "@Router/index";
import useTestNavigation from "@Hooks/useProductNavigation";
import { useReviewQuestion } from "./useReviewQuestion";
import { FormatLangText } from "@Components/Editor/SunEditor/utils";
import { TEXTS } from "texts/texts";

const { Title, Text } = Typography;

interface TestPlayerItemReiewPropsI {
  testId?: string;
  questionId?: string;
}

export default function TestPlayerItemReiew(props: TestPlayerItemReiewPropsI) {
  const [form] = Form.useForm();
  const { data: topics } = Learner.Queries.useGetTopics();
  const params = useParams<{ questionId: string; testId: string }>();
  const questionId = (props.questionId || params.questionId) + "";
  const testId = (props.testId || params.testId) + "";
  const {
    currentQuestion,
    currentSection,
    currentQuestionIndex,
    loading: loadingQuestion,
  } = useReviewQuestion({ questionId, testId });
  const topic = topics.find((topic) => topic._id === currentQuestion.topic);
  const answerGiven = currentQuestion.answerGiven;
  const { data: test } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.RESULT
  );
  const {
    data: {
      metadata: {
        test: { language },
      },
    },
    isLoading: loadingEp,
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: test._id + "",
  });
  useEffect(() => {
    let answer = answerGiven;
    if (
      currentQuestion.type === Enum.TestQuestionType.SINGLE &&
      answerGiven &&
      answerGiven?.options?.length
    ) {
      // @ts-ignore
      answer = { options: answerGiven?.options[0] };
    }
    if (
      currentQuestion.type === Enum.TestQuestionType.MULTIPLE &&
      answerGiven &&
      answerGiven &&
      answerGiven.options.length
    ) {
      // @ts-ignore
      answer = { options: answerGiven?.options };
    }

    if (
      currentQuestion.type === Enum.TestQuestionType.NUMERIC &&
      !isNaN(Number(answerGiven?.numeric))
    ) {
      // @ts-ignore
      answer = { numeric: answerGiven.numeric };
    }
    form.setFieldsValue({
      answer,
    });
  }, [currentQuestion, form, questionId]);
  const answer = Form.useWatch(["answer"], form);
  const { navigate } = useTestNavigation(test, "review");
  const OptionSelectedFormControl =
    currentQuestion.type === Enum.TestQuestionType.SINGLE ? Radio : Checkbox;
  const answerText = htmlToText(answer?.subjective?.text);
  // @ts-ignore
  const globalCorrectPercent = currentQuestion.analytics?.attempted
    ? Math.ceil(
      (currentQuestion.analytics?.correctAttempts /
        currentQuestion.analytics?.attempted) *
      100
    )
    : null;

  const { token } = theme.useToken();
  const { isMobile } = useBreakpoint();
  const correctOptions = currentQuestion?.options
    ?.filter((i) => i.isCorrect)
    .map((i) => i._id);

  const NextButton = (
    <Button
      shape={!isMobile ? "default" : "circle"}
      onClick={() => navigate("next")}
      icon={<ForwardOutlined />}
    >
      {!isMobile ? FormatLangText(TEXTS.NEXT, language) : ""}
    </Button>
  );
  const { isDesktop, width } = useBreakpoint();
  const {
    isLoading: loadingResult,
    data: {
      test: { sections },
    },
  } = Learner.Queries.useGetTestResult(testId + "");
  const questions = useMemo(() => {
    return sections.map((i) => i.items).flat();
  }, [sections]);
  const PrevButton = (
    <Button
      shape={!isMobile ? "default" : "circle"}
      onClick={() => navigate("prev")}
      style={{ marginRight: !isMobile ? 20 : 0 }}
      icon={<BackwardOutlined />}
    >
      {!isMobile ? FormatLangText(TEXTS.PREVIOUS, language) : ""}
    </Button>
  );
  return loadingQuestion ? (
    <TestItemSkeleton />
  ) : (
    <>
      {!isDesktop ? (
        <Row align={"middle"}>
          <Col flex={1} style={{ width: 0.72 * width }}>
            {" "}
            <ul
              style={{
                display: "flex",
                marginBottom: 15,
                listStyle: "none",
                padding: 0,
                overflowX: "auto",
                scrollbarWidth: "none", // For Firefox
                msOverflowStyle: "none", // For Internet Explorer and Edge
              }}
            >
              {questions.map((item, index) => {
                return (
                  <li key={item._id} style={{ flexShrink: 0, marginRight: 8 }}>
                    <NavLink
                      title={item.title}
                      style={{ width: "100%" }}
                      key={item._id}
                      to={`/app/test/${testId}/review/${item._id}`}
                      children={() => {
                        const isActive = questionId === item._id;
                        return (
                          <Button
                            onClick={() =>
                              navigate(`/app/test/${testId}/review/${item._id}`)
                            }
                            danger={item.isMarked}
                            type={
                              isActive
                                ? "primary"
                                : item.isMarked
                                  ? "primary"
                                  : item.isAnswered
                                    ? "primary"
                                    : "default"
                            }
                            style={{
                              backgroundColor: isActive
                                ? ""
                                : item.isAnswered
                                  ? item.type !== "subjective"
                                    ? item.isCorrect
                                      ? token.colorSuccessActive
                                      : token.colorError
                                    : token.colorWarningActive
                                  : "default",
                            }}
                            shape="circle"
                          >
                            {index + 1}
                          </Button>
                        );
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </Col>
        </Row>
      ) : null}
      <Card
        bodyStyle={{
          paddingLeft: 35,
        }}
        title={
          <Text>
            Question {currentQuestionIndex + 1}
            {topic?.title ? (
              <Tooltip title={topic?.title ? `${topic?.title}` : null}>
                <InfoCircleTwoTone style={{ marginLeft: 8 }} />
              </Tooltip>
            ) : null}
          </Text>
        }
        extra={[
          isMobile ? (
            <>
              {/* {currentQuestion.isCorrect ? (
                <CheckCircleTwoTone
                  style={{
                    marginRight: 5,
                    position: "relative",
                    top: 1,
                    fontSize: 20,
                    color: "green",
                  }}
                />
              ) : (
                <CloseCircleTwoTone
                  style={{
                    marginRight: 5,
                    position: "relative",
                    top: 3,
                    fontSize: 20,
                    color: "red",
                  }}
                />
              )} */}
            </>
          ) : (
            <TestAnswerTag item={currentQuestion} />
          ),
          !currentQuestion.notEvaluated ? (
            currentQuestion.scoreAchieved !== undefined ? (
              <Tag
                color={
                  currentQuestion.scoreAchieved > 0
                    ? // @ts-ignore
                    "green-inverse"
                    : "red-inverse"
                }
              >
                Score: {currentQuestion.scoreAchieved}
                {currentQuestion.type === "subjective"
                  ? "/" + currentSection?.score?.correct
                  : ""}
              </Tag>
            ) : (
              <Tag color="red-inverse">Score: 0</Tag>
            )
          ) : null,
          globalCorrectPercent !== null &&
            currentQuestion.type !== "subjective" ? (
            <Tooltip
              title={`${globalCorrectPercent < 50 && globalCorrectPercent !== 0
                ? "Only "
                : ""
                }${globalCorrectPercent}% people were able to answer this question correctly`}
            >
              <Tag color="purple-inverse" icon={<GlobalOutlined />}>
                {globalCorrectPercent} %
              </Tag>
            </Tooltip>
          ) : null,
        ]}
      >
        <Form layout="vertical" form={form}>
          <div style={{ minHeight: "50vh" }}>
            <Row gutter={[20, 30]}>
              <Col span={24}>
                <Paragraph style={{ fontSize: 15 }}>
                  {/* @ts-ignore */}
                  {loadingEp ? (
                    <Skeleton paragraph={{ rows: 1 }} />
                  ) : (
                    <HtmlViewer
                      content={currentQuestion.title?.text[language] + ""}
                    />
                  )}
                </Paragraph>
                {currentQuestion.type !== "subjective" ? (
                  currentQuestion.type === Enum.TestQuestionType.SINGLE ||
                    currentQuestion.type === Enum.TestQuestionType.MULTIPLE ? (
                    <>
                      <Text
                        style={{
                          marginTop: 20,
                          fontSize:
                            currentQuestion.type ===
                              Enum.TestQuestionType.SINGLE
                              ? 16
                              : 18,
                        }}
                        type="secondary"
                      >
                        {currentQuestion.type === Enum.TestQuestionType.SINGLE
                          ? FormatLangText(TEXTS.SELECT_ONE, language)
                          : FormatLangText(TEXTS.SELECT_MULTIPLE, language)}
                      </Text>
                      <Form.Item name={["answer", "options"]}>
                        <OptionSelectedFormControl.Group
                          style={{ width: "100%", display: "block" }}
                        >
                          <List
                            style={{
                              position: "relative",
                              left: -23,
                            }}
                            dataSource={currentQuestion?.options}
                            renderItem={(option, index) => {
                              // const SelectFormControlComponent = (
                              //   <OptionSelectedFormControl
                              //     style={{ marginRight: 0 }}
                              //     disabled
                              //     value={option._id}
                              //   ></OptionSelectedFormControl>
                              // );
                              const SelectFormControlComponent = (
                                <Row
                                  style={{ width: "100%" }}
                                  gutter={[0, 20]}
                                  align={"middle"}
                                >
                                  <Col span={1}>
                                    <Text
                                      style={{ textTransform: "capitalize" }}
                                      strong
                                    >
                                      {String.fromCharCode(97 + index)}
                                    </Text>
                                  </Col>
                                  <Col span={23} style={{ paddingLeft: 15 }}>
                                    <OptionSelectedFormControl
                                      disabled
                                      value={option._id}
                                    >
                                      <Paragraph
                                        style={{
                                          margin: 0,
                                          ...(language === "hin"
                                            ? { fontSize: 16 }
                                            : { fontSize: 15 }),
                                        }}
                                      >
                                        {/* @ts-ignore */}
                                        <HtmlViewer
                                          content={option.text[language]}
                                        />
                                      </Paragraph>
                                    </OptionSelectedFormControl>
                                  </Col>
                                </Row>
                              );
                              return (
                                <List.Item>
                                  <Row gutter={[0, 20]} key={option._id}>
                                    <Col span={24}>
                                      <Space
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "flex-start",
                                        }}
                                      >
                                        <Tooltip
                                          placement="top"
                                          title={`Correct Answer`}
                                        >
                                          <CheckCircleTwoTone
                                            style={{
                                              position: "relative",
                                              top: 1,
                                              visibility:
                                                correctOptions?.indexOf(
                                                  option?._id
                                                ) > -1
                                                  ? "visible"
                                                  : "hidden",
                                            }}
                                            color={token.colorSuccessBg}
                                          />
                                        </Tooltip>
                                        {SelectFormControlComponent}
                                      </Space>
                                    </Col>
                                  </Row>
                                </List.Item>
                              );
                            }}
                          />
                        </OptionSelectedFormControl.Group>
                      </Form.Item>
                    </>
                  ) : null
                ) : (
                  <>
                    {test.input.type === Enum.TestInputType.HANDWRITTEN ? (
                      <TestPlayerFiles
                        review
                        testId={testId + ""}
                        questionId={questionId + ""}
                      />
                    ) : answerGiven?.subjective?.text ? (
                      <Form.Item label="Answer Given">
                        <HtmlViewer content={answerGiven?.subjective?.text} />
                      </Form.Item>
                    ) : (
                      <Tag color="red">Not Answered</Tag>
                    )}
                  </>
                )}
                {currentQuestion.type === Enum.TestQuestionType.NUMERIC ? (
                  <Form.Item
                    style={{ marginTop: 20 }}
                    label="Answer Given"
                    name={["answer", "numeric"]}
                  >
                    {currentQuestion.isAnswered ? (
                      <Input style={{ width: 150 }} type="number" readOnly />
                    ) : (
                      <TestAnswerTag item={currentQuestion} />
                    )}
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
          </div>

          {!props.questionId ? (
            <Row justify="space-between" style={{ marginTop: 10 }}>
              {!isMobile ? (
                <Col
                  style={{ display: "flex", justifyContent: "space-between" }}
                  flex={1}
                >
                  {PrevButton}
                  {NextButton}
                </Col>
              ) : null}
              <Col
                style={{
                  display: "flex",
                  flex: isMobile ? 1 : "",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                }}
              >
                <Fragment>
                  {isMobile ? NextButton : null}
                  {isMobile ? PrevButton : null}
                </Fragment>
              </Col>
            </Row>
          ) : null}
        </Form>
      </Card>
    </>
  );
}
