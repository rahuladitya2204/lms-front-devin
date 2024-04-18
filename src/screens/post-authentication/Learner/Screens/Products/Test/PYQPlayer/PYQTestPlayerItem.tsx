"use client";
import {
  BackwardOutlined,
  CheckCircleTwoTone,
  ForwardOutlined,
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
} from "antd";
import { Constants, Enum, Learner, Types } from "@adewaskar/lms-common";
import { Fragment, useEffect, useMemo, useState } from "react";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Paragraph } from "@Components/Typography/Typography";
import { TestAnswerTag } from "../TestResult/Table/TestResultTable";
import TestItemSkeleton from "../TestReview/TestItemSkeleton";
import TextArea from "@Components/Textarea";
import { Typography } from "@Components/Typography";
import { htmlToText } from "html-to-text";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useOutletContext } from "react-router-dom";
import useTestNavigation from "@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation";
import { NavLink, useParams } from "@Router/index";

const { Title, Text } = Typography;

interface TestPublicPlayerItemReiewPropsI {
  testId?: string;
  questionId?: string;
  language?: string;
  isServer?: boolean;
}

export default function TestPublicPlayerItemReiew(
  props: TestPublicPlayerItemReiewPropsI
) {
  const [form] = Form.useForm();
  // { questionId, testId }
  const params = useParams();
  const questionId = props.questionId || params.questionId;
  const testId = props.testId || params.testId;
  const {
    currentQuestion,
    currentQuestionIndex,
    loading: loadingQuestion,
  } = useQuestion({ questionId, testId });
  const { data: test } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.RESULT
  );
  // const language = 'eng';
  const { navigate } = useTestNavigation(test, "pyq", props.isServer);
  const OptionSelectedFormControl =
    currentQuestion.type === Enum.TestQuestionType.SINGLE ? Radio : Checkbox;

  const { token } = theme.useToken();
  const { isMobile } = useBreakpoint();

  const NextButton = (
    <Button
      shape={!isMobile ? "default" : "circle"}
      onClick={() => navigate("next")}
      icon={<ForwardOutlined />}
    >
      {!isMobile ? "Next" : ""}
    </Button>
  );
  const { isDesktop, width } = useBreakpoint();
  const questions = useMemo(() => {
    return test.sections.map((i) => i.items).flat();
  }, [test.sections]);
  // console.log(questions, "questions");
  const PrevButton = (
    <Button
      shape={!isMobile ? "default" : "circle"}
      onClick={() => navigate("prev")}
      style={{ marginRight: !isMobile ? 20 : 0 }}
      icon={<BackwardOutlined />}
    >
      {!isMobile ? "Previous" : ""}
    </Button>
  );

  const context: { language: string } = useOutletContext();

  const language = context?.language || props.language || "eng";
  // todo
  return (
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
                // '&::-webkit-scrollbar': {
                //   display: 'none', // For Chrome, Safari, and Opera
                // }
              }}
            >
              {questions.map((item, index) => {
                return (
                  <li key={item._id} style={{ flexShrink: 0, marginRight: 8 }}>
                    <NavLink
                      title={item.title}
                      style={{ width: "100%" }}
                      key={item._id}
                      to={
                        props.isServer
                          ? `/test/${testId}/pyq/${item._id}`
                          : `/app/test/${testId}/pyq/${item._id}`
                      }
                      children={() => {
                        const isActive = questionId === item._id;
                        return (
                          // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                          // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                          <Button
                            // loading={loading && isCurrent}
                            onClick={() => navigate(item._id + "")}
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
                            // icon={
                            //   item.isAnswered ? (
                            //     <Fragment>
                            //       {item.isCorrect ? (
                            //         <CheckOutlined />
                            //       ) : (
                            //         <CloseOutlined />
                            //       )}
                            //     </Fragment>
                            //   ) : null
                            // }
                          >
                            {index + 1}
                          </Button>
                          //  </Badge>
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
        title={`Question ${currentQuestionIndex + 1}`}
        extra={[
          currentQuestion.difficultyLevel ? (
            <Tag>{currentQuestion.difficultyLevel.toUpperCase()}</Tag>
          ) : null,
          <Tag color="green-inverse">
            {!isMobile ? "Correct:" : null} +{currentQuestion.score.correct}
          </Tag>,
          <Tag color="red-inverse">
            {!isMobile ? "Incorrect:" : null} -{currentQuestion.score.correct}
          </Tag>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <div style={{ minHeight: "50vh" }}>
            <Row gutter={[20, 30]}>
              <Col span={24}>
                <Paragraph style={{ fontSize: 15 }}>
                  {/* @ts-ignore */}
                  {loadingQuestion ? (
                    <Skeleton paragraph={{ rows: 1 }} />
                  ) : (
                    <Title style={{ fontSize: 16, fontWeight: 600 }}>
                      <HtmlViewer
                        content={currentQuestion.title?.text[language] + ""}
                      />
                    </Title>
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
                        {/* {currentQuestion.type === Enum.TestQuestionType.SINGLE
                          ? "Select one among others"
                          : "Select all that apply"} */}
                        <Divider />
                      </Text>
                      <Form.Item name={["answer", "options"]}>
                        <div style={{ paddingLeft: 15 }}>
                          <List
                            dataSource={currentQuestion?.options}
                            renderItem={(option, index) => {
                              return (
                                <Row gutter={[0, 20]} key={option._id}>
                                  <Col span={24}>
                                    <Space
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        // marginLeft: 10,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          textTransform: "capitalize",
                                          marginLeft: option.isCorrect
                                            ? -18
                                            : "auto",
                                          // marginRight: 10,
                                        }}
                                        strong
                                      >
                                        {option.isCorrect ? (
                                          <Tooltip
                                            placement="top"
                                            title={`Correct Answer`}
                                          >
                                            <CheckCircleTwoTone
                                              style={{
                                                position: "relative",
                                                top: 0,
                                                left: -5,
                                              }}
                                              color={token.colorSuccessBg}
                                            />
                                          </Tooltip>
                                        ) : null}{" "}
                                        {String.fromCharCode(97 + index)}
                                      </Text>
                                      {/* {SelectFormControlComponent} */}
                                      <Paragraph
                                        style={
                                          language !== "eng"
                                            ? {
                                                fontSize: 16,
                                              }
                                            : {
                                                fontSize: 15,
                                              }
                                        }
                                      >
                                        {/* @ts-ignore */}
                                        <HtmlViewer
                                          content={option.text[language]}
                                        />
                                      </Paragraph>
                                    </Space>
                                  </Col>
                                </Row>
                              );
                            }}
                          />
                        </div>
                      </Form.Item>
                    </>
                  ) : null
                ) : (
                  <>
                    {/* {test.input.type === Enum.TestInputType.HANDWRITTEN ?
                  <TestPublicPlayerFiles review testId={testId + ''} questionId={questionId + ''} /> :
                  (answerGiven?.subjective?.text) ? <Form.Item label='Answer Given'>
                  <HtmlViewer content={answerGiven?.subjective?.text} />
                </Form.Item>:<Tag color='red' >Not Answered</Tag>}      */}
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

export function useQuestion(d?: { testId: string; questionId: string }) {
  const params = useParams();
  const testId = d?.testId || params.testId;
  const questionId = d?.questionId || params.questionId;
  const {
    data: { sections },
    isFetching,
  } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.RESULT
  );
  const questions = sections.map((e) => e.items).flat();
  const currentQuestionIndex: number = questions.findIndex(
    (q) => q._id === questionId
  );
  const currentQuestion = questions[currentQuestionIndex] || {
    ...Constants.INITIAL_TEST_QUESTION,
    feedback: {
      met: "",
      notMet: "",
    },
  };
  // console.log(currentQuestion, d?.testId, d?.questionId, "oh ywag");
  return {
    currentQuestion,
    currentQuestionIndex,
    loading: isFetching,
  };
}
