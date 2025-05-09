"use client";
import {
  AimOutlined,
  AppstoreOutlined,
  BackwardOutlined,
  CheckCircleTwoTone,
  CheckOutlined,
  DeleteOutlined,
  FlagOutlined,
  ForwardOutlined,
  InsertRowBelowOutlined,
  ReloadOutlined,
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
  Space,
  Spin,
  Tag,
  Tooltip,
  theme,
} from "antd";
import { Enum, Learner, Store, Types } from "@adewaskar/lms-common";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { NavLink } from "@Router/index";
import { Paragraph } from "@Components/Typography/Typography";

import TextArea from "@Components/Textarea";
import { Typography } from "@Components/Typography";
import { htmlToText } from "html-to-text";
import useBreakpoint from "@Hooks/useBreakpoint";

import { useParams } from "@Router/index";
import useQuestion from "../hooks/useQuestion";

import useTestNavigation from "@Hooks/useProductNavigation";
import TestPlayerFiles from "./TestPlayerFiles";
import { SubmitButton } from "../TestPlayer";
import { useText } from "@Components/Editor/SunEditor/utils";

const { Title, Text } = Typography;

interface TestPlayeritemPropsI { }

export default function TestPlayeritem(props: TestPlayeritemPropsI) {
  // useTestItemTime();
  const { questionId, testId } = useParams<{
    questionId: string;
    testId: string;
  }>();
  const { mutate: updateQuestionResponseFlag, isLoading: updatingFlag } =
    Learner.Queries.useUpdateQuestionResponseFlag(testId + "");
  const { token } = theme.useToken();
  const [form] = Form.useForm<Types.SubmitTestAnswer>();
  // const { mutate: submitAnswer, isLoading: submittingAnswer } = Learner.Queries.useSubmitTestAnswer();
  const { data: test } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.TEST
  );
  const { data: ep } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: test._id + "",
  });
  const language = ep?.metadata?.test?.language;
  const { FormatLangText } = useText(language);
  // console.log(ep, language, "huhhahaha");
  const {
    currentQuestion,
    currentSection,
    currentQuestionIndex,
    loading,
    totalQuestionCount,
  } = useQuestion();

  const {
    data: {
      status: { sections },
    },
  } = Learner.Queries.useGetTestStatus(testId + "");
  const questions = useMemo(() => {
    return sections.map((i) => i.items).flat();
  }, [sections]);

  const { mutate: submitAnswer, isLoading: submittingAnswer } =
    Learner.Queries.useSubmitTestAnswer(testId + "");
  const answer = Form.useWatch(["answer"], form);
  const { isMobile } = useBreakpoint();
  const questionType = currentQuestion.type;
  useEffect(() => {
    const { answerGiven } = currentQuestion;
    let answer = answerGiven;
    if (
      questionType === Enum.TestQuestionType.SINGLE &&
      answerGiven &&
      answerGiven.options &&
      answerGiven.options.length
    ) {
      // @ts-ignore
      answer = { options: answerGiven.options[0] };
    }
    // @ts-ignore
    form.setFieldsValue({
      answer,
    });
  }, [currentQuestion, form, questionId]);
  const isValid =
    answer?.options?.length ||
    answer?.subjective?.text ||
    answer?.subjective?.files?.length ||
    !isNaN(Number(answer?.numeric)) ||
    currentQuestion.type === Enum.TestQuestionType.FILL_IN_THE_BLANK;

  // @ts-ignore
  const onFormSubmit = ({ answer }) => {
    if (!isValid) {
      return;
    }
    if (questionType === Enum.TestQuestionType.SINGLE) {
      // @ts-ignore
      answer = { options: [answer.options] };
    }

    submitAnswer(
      {
        testId: testId + "",
        questionId: questionId + "",
        answer: answer,
      },
      {
        onSuccess: () => {
          // navigate("next");
        },
      }
    );
    navigate("next");
  };
  const ClearAnswerButton = (
    <Button
      size="small"
      onClick={() =>
        form.setFieldsValue({
          answer: {
            options: [],
            subjective: {
              text: "",
            },
            numeric: null,
          },
        })
      }
      type="dashed"
      icon={<ReloadOutlined />}
      style={{ marginLeft: 20 }}
    >
      {FormatLangText('CLEAR')}
    </Button>
  );
  const { navigate } = useTestNavigation(test, "player");
  const OptionSelectedFormControl =
    questionType === Enum.TestQuestionType.SINGLE ? Radio : Checkbox;
  const answerText = htmlToText(answer?.subjective?.text);
  const wordLength = answerText.split(" ").length;
  const PrevButton = (
    <Button
      id='previous-button'
      shape={!isMobile ? "default" : "circle"}
      onClick={() => navigate("prev")}
      style={{ marginRight: !isMobile ? 20 : 0 }}
      icon={<BackwardOutlined />}
    >
      {!isMobile ? FormatLangText('PREVIOUS') : ""}
    </Button>
  );
  const NextButton = (
    <Button
      id='next-button'
      shape={!isMobile ? "default" : "circle"}
      onClick={() => navigate("next")}
      icon={<ForwardOutlined />}
    >
      {!isMobile ? FormatLangText('NEXT') : ""}
    </Button>
  );
  const MarkForReviewCheckbox = (
    <Col style={{ display: "flex", justifyContent: "center", flex: 1 }}>
      {/* <Spin spinning={updatingFlag}> */}
      <Checkbox
        checked={currentQuestion.isMarked}
        onChange={(e) =>
          updateQuestionResponseFlag({
            questionId: questionId + "",
            flag: e.target.checked ? "review-later" : "reviewed",
          })
        }
      >
        <Text strong>Mark for Review</Text>
      </Checkbox>
      {/* </Spin> */}
    </Col>
  );
  const MarkForReviewButton = currentQuestion.isMarked ? (
    <Button
      block={isMobile}
      style={{ marginBottom: isMobile ? 5 : 0 }}
      // loading={updatingFlag}
      type="primary"
      onClick={() =>
        updateQuestionResponseFlag({
          questionId: questionId + "",
          flag: "reviewed",
        })
      }
      icon={<CheckOutlined />}
      danger
    >
      {FormatLangText('MARK_AS_DONE')}
    </Button>
  ) : (
    <Button
      block={isMobile}
      style={{ marginBottom: isMobile ? 5 : 0 }}
      // loading={updatingFlag}
      onClick={() =>
        updateQuestionResponseFlag({
          questionId: questionId + "",
          flag: "review-later",
        })
      }
      icon={<FlagOutlined />}
      danger
      type="default"
    >
      {FormatLangText('MARK_FOR_REVIEW')}
    </Button>
  );

  const questionRefs = useRef([]);
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  // Function to scroll into view with proper timing
  const scrollToActiveButton = useCallback(() => {
    if (
      questionRefs.current[currentQuestionIndex] &&
      scrollContainerRef.current
    ) {
      setTimeout(() => {
        questionRefs.current[currentQuestionIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100); // Add a small delay to ensure elements are rendered
    }
  }, [currentQuestionIndex]);


  // Trigger scroll effect when currentQuestionIndex changes
  useEffect(() => {
    scrollToActiveButton();
  }, [currentQuestionIndex, scrollToActiveButton]);

  // console.log(currentQuestion,'currentQuestion')
  // const correctOptions = currentQuestion.options.filter(e => e.isCorrect).map(i=>i._id);
  const { width, isDesktop } = useBreakpoint();
  return (
    <Spin spinning={loading}>
      {!isDesktop ? (
        <Row align={"middle"}>
          <Col flex={1} style={{ width: 0.72 * width }}>
            <ul
              ref={scrollContainerRef}
              style={{
                display: "flex",
                marginBottom: 15,
                listStyle: "none",
                padding: 0,
                overflowX: "auto",
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {questions.map((item, index) => {
                const isActive = currentQuestionIndex === index;
                return (
                  <li
                    key={item._id}
                    style={{ flexShrink: 0, marginRight: 8 }}
                    ref={(el) => (questionRefs.current[index] = el)}
                  >
                    <NavLink
                      title={item.title}
                      style={{ width: "100%" }}
                      key={item._id}
                      to={`/app/test/${testId}/player/${item._id}`}
                    >
                      <Button
                        danger={item.isMarked && !isActive}
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
                              ? token.colorSuccessActive
                              : "default",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          marginRight: 5,
                        }}
                        shape="circle"
                      >
                        {index + 1}
                      </Button>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </Col>
        </Row>
      ) : null}
      <Card
        title={`${FormatLangText('QUESTION')} ${currentQuestionIndex + 1}`}
        extra={[
          <Tag
            style={{ fontSize: 15, padding: "2px 5px" }}
            color="blue-inverse"
          >
            {!isMobile ? `${FormatLangText('CORRECT_ANSWER_SCORE')}: ` : "+"}
            {currentSection?.score?.correct}
          </Tag>,
          currentSection?.score?.incorrect ? (
            <Tag
              style={{ fontSize: 15, padding: "2px 5px" }}
              color="red-inverse"
            >
              {!isMobile ? `${FormatLangText('INCORRECT_ANSWER_SCORE')}: ` : ""}{" "}
              {currentSection?.score?.incorrect}
            </Tag>
          ) : null,
        ]}
      >
        <Form layout="vertical" form={form} onFinish={onFormSubmit}>
          <div style={{ minHeight: "50vh" }}>
            <Row gutter={[20, 30]}>
              <Col span={24}>
                <Paragraph
                  style={
                    language === "hin" ? { fontSize: 16 } : { fontSize: 15 }
                  }
                >
                  {/* @ts-ignore */}

                  <HtmlViewer content={currentQuestion.title.text[language]} />
                </Paragraph>
                <Divider />
                {questionType !== Enum.TestQuestionType.SUBJECTIVE ? (
                  <>
                    <Row justify={"space-between"}>
                      <Col>
                        <Text
                          style={{
                            marginTop: 20,
                            fontSize:
                              questionType === Enum.TestQuestionType.SINGLE
                                ? 16
                                : 18,
                          }}
                          type="secondary"
                        >
                          {questionType === Enum.TestQuestionType.SINGLE
                            ? FormatLangText('SELECT_ONE')
                            : null}
                          {questionType === Enum.TestQuestionType.MULTIPLE
                            ? "Select all that apply"
                            : null}
                          {questionType ===
                            Enum.TestQuestionType.FILL_IN_THE_BLANK
                            ? "Fill in the blank below"
                            : null}
                        </Text>
                      </Col>
                      <Col>{ClearAnswerButton}</Col>
                      {/* <Col><Button>Clear</Button></Col> */}
                    </Row>
                    {questionType === Enum.TestQuestionType.SINGLE ||
                      questionType === Enum.TestQuestionType.MULTIPLE ? (
                      <Form.Item name={["answer", "options"]}>
                        <OptionSelectedFormControl.Group
                          style={{ width: "100%", display: "block" }}
                        >
                          <List
                            dataSource={currentQuestion.options}
                            renderItem={(option, index) => {
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
                                  <Col span={23}>
                                    <OptionSelectedFormControl
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
                                  {SelectFormControlComponent}
                                </List.Item>
                              );
                            }}
                          />
                          {/* {currentQuestion.options
                          .map((option: Types.TestQuestionOption, index: number) => {
                    const SelectFormControlComponent=      <OptionSelectedFormControl value={option._id}>
                    <HtmlViewer content={option.text} />
                  </OptionSelectedFormControl>
                    return (
                      <Row gutter={[0, 20]} key={option._id}>
                        <Col span={24}>
                         {SelectFormControlComponent}
                        </Col>
                      </Row>
                    );
                  })} */}
                        </OptionSelectedFormControl.Group>
                      </Form.Item>
                    ) : null}
                    {questionType === Enum.TestQuestionType.NUMERIC ? (
                      <Form.Item
                        style={{ marginTop: 20 }}
                        label="Enter Answer"
                        name={["answer", "numeric"]}
                      >
                        <Input
                          style={{ width: 200 }}
                          placeholder="Enter the answer here"
                          type="number"
                        />
                      </Form.Item>
                    ) : null}

                    {questionType ===
                      Enum.TestQuestionType.FILL_IN_THE_BLANK ? (
                      <Row style={{ marginTop: 20 }}>
                        <Col span={24}>
                          {/* @ts-ignore */}
                          {currentQuestion.fillInTheBlanks.blanks?.map(
                            (item, index) => {
                              // @ts-ignore
                              const blankSpaceId = item._id; // Example ID generation. Adjust based on your actual data.

                              return (
                                <span
                                  key={blankSpaceId}
                                  style={{ marginRight: 10 }}
                                >
                                  {item.isBlank ? (
                                    <Form.Item
                                      name={["answer", "blanks", blankSpaceId]}
                                      noStyle
                                    >
                                      <Input
                                        style={{ width: 100 }}
                                        placeholder="Enter something"
                                      />
                                    </Form.Item>
                                  ) : (
                                    <span>{item.text}</span>
                                  )}
                                </span>
                              );
                            }
                          )}
                        </Col>
                      </Row>
                    ) : null}
                  </>
                ) : (
                  <>
                    {test.input.type === Enum.TestInputType.HANDWRITTEN ? (
                      <Form.Item>
                        {/* @ts-ignore */}
                        <TestPlayerFiles
                          questionId={questionId + ""}
                          testId={testId + ""}
                          form={form}
                        />
                      </Form.Item>
                    ) : (
                      <Fragment>
                        {/* <Divider>(Pls note: either images above or answer below will be considered)</Divider> */}
                        <Text strong type="danger">
                          Answer in {currentQuestion.wordLimit} words
                        </Text>
                        <Form.Item
                          style={{ marginTop: 10 }}
                          label={
                            <Text>
                              Enter Answer below -{" "}
                              <Text type="danger">{wordLength} words</Text>
                            </Text>
                          }
                          name={["answer", "subjective", "text"]}
                        >
                          <TextArea height={400} html={{ level: 1 }} />
                        </Form.Item>
                      </Fragment>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </div>

          <Row justify="space-between">
            {!isMobile ? (
              <Col flex={1}>
                {PrevButton}
                {NextButton}
              </Col>
            ) : null}
            {isMobile ? MarkForReviewCheckbox : MarkForReviewButton}
            {isMobile ? <Divider /> : null}
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
                <div style={{ marginLeft: 20, marginRight: 20, width: "80%" }}>
                  <Button
                    disabled={!isValid}
                    type="primary"
                    block
                    id='save-and-next'
                    // loading={submittingAnswer}
                    onClick={form.submit}
                  >
                    {FormatLangText('SAVE_AND_NEXT')}
                  </Button>
                </div>

                {/* {ClearAnswerButton} */}
                {isMobile ? PrevButton : null}
              </Fragment>
            </Col>
            {currentQuestionIndex === totalQuestionCount - 1 ? (
              <Col span={24}>
                <div
                  style={{
                    // marginLeft: 20,
                    // marginRight: 20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 15,
                  }}
                >
                  <SubmitButton testId={testId + ""} />
                </div>
              </Col>
            ) : null}
            {/* {!isMobile?MarkForReviewButton:null} */}
          </Row>
        </Form>
      </Card>
    </Spin>
  );
}
