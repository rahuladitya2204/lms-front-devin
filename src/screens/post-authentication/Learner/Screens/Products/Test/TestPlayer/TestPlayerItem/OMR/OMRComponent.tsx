import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  message,
  Modal,
  Radio,
  Row,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import { Enum, Learner, Types, User } from "@adewaskar/lms-common";
import React, { useEffect, useState } from "react";

import { ReloadOutlined } from "@ant-design/icons";
import { Title } from "@Components/Typography/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";

const confirm = Modal.confirm;

interface OMRComponentPropsI {
  testId: string;
  closeModal?: Function;
  type?: string;
  learnerId?: string;
  readonly?: boolean;
}

const OMRComponent: React.FC<OMRComponentPropsI> = ({
  testId,
  closeModal,
  type,
  learnerId,
  readonly,
}) => {
  const NAMESPACE = type === "user" ? User : Learner;
  const { data: test } = NAMESPACE.Queries.useGetTestDetails(
    testId,
    // @ts-ignore
    Enum.TestDetailMode.TEST
  );
  // @ts-ignore
  const {
    data: {
      status: { sections },
    },
    isLoading,
  } = NAMESPACE.Queries.useGetTestStatus(
    testId + "",
    // @ts-ignore
    learnerId
  );
  // console.log(sections, 'hullla');

  // @ts-ignore
  const { mutate: submitResponses, isLoading: submittingResponses } =
    NAMESPACE.Queries.useSubmitTestResponses(testId, learnerId);

  useEffect(() => {
    // @ts-ignore
    const items = sections
      .map((i) => i.items)
      .flat()
      // @ts-ignore
      .map((i) => {
        // console.log(i,'item')
        return i.type === Enum.TestQuestionType.SINGLE
          ? i.answerGiven?.options
            ? i.answerGiven?.options[0]
            : null
          : i?.answerGiven?.options;
      });
    form.setFieldValue(["answers"], items);
  }, [sections]);

  const items = test?.sections?.map((i) => i.items).flat() || [];
  const [form] = Form.useForm();
  const splitAfter = 30; // Adjust as needed
  const resetQuestion = (index: number) => {
    const answers = form.getFieldValue(["answers"]);
    const resetValue =
      items[index].type === Enum.TestQuestionType.SINGLE ? "" : [];
    answers[index] = resetValue;
    form.setFieldValue(["answers"], answers);
  };
  const formatQuestionNumber = (number: number) => {
    // return  isMobile?number: number.toLocaleString('en-US', {
    //   minimumIntegerDigits: 3,
    //   useGrouping: false
    // });
    return number;
  };

  const handleSubmit = (values: any) => {
    const resp: Types.TestAnswer[] = [];
    // console.log(values,'vv')
    // @ts-ignore
    items.forEach((item, index) => {
      const i = {
        questionId: item._id,
        question: item._id,
        submittedAt: new Date(),
        answer: {
          options:
            item.type === Enum.TestQuestionType.SINGLE
              ? [values.answers[index]]
              : values.answers[index],
        },
      };
      if (values.answers[index]) {
        // @ts-ignore
        resp.push(i);
      }
    });
    // .filter(question => question.options != null && question.options.length > 0);

    // console.log(resp);
    const body: any = { responses: resp };
    if (learnerId) {
      body.learnerId = learnerId;
    }
    // @ts-ignore
    submitResponses(body, {
      onSuccess: () => {
        message.open({
          type: "success",
          content: "Answers Recorded",
        });
        closeModal && closeModal();
      },
    });
    // Submit `answeredQuestions` to your API or handle it as needed
  };
  const { isDesktop, isMobile } = useBreakpoint();
  const splitIndex = Math.ceil(items.length / 2);
  const ResetAnswerButton = (
    <Button
      block={isMobile}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          // icon: <ExclamationCircleOutlined />,
          content: `You want to reset answer sheet`,
          onOk() {
            form.resetFields();
            // form.submit()
            message.open({ type: "info", content: "Answer Sheet Resetted" });
          },
          okText: "Yes, Reset",
        });
      }}
    >
      Reset Answer Sheet
    </Button>
  );
  return (
    <Spin spinning={isLoading}>
      <Form form={form} className="omr-sheet" onFinish={handleSubmit}>
        <Row
          style={{ marginTop: 20 }}
          justify={"space-between"}
          align={"middle"}
        >
          {/* <Col><Title level={3}>Answer Sheet</Title></Col> */}
          {/* {!isMobile? <Col>{ResetAnswerButton}</Col>:null} */}
        </Row>
        <Form.List name="answers">
          {(fields, { add, remove }) => (
            <>
              <Row gutter={[5, 5]}>
                {items.map((item, index) => {
                  const isInFirstColumn = index < splitAfter;
                  return (
                    <Col xs={24} sm={24} md={12} lg={8}>
                      <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                      >
                        <Row
                          justify="start"
                          align="middle"
                          style={{ alignItems: "baseline" }}
                        >
                          <Col span={2}>
                            <Typography.Text strong>
                              {formatQuestionNumber(index + 1)}
                            </Typography.Text>
                          </Col>
                          <Col span={22}>
                            <Row
                              align={"middle"}
                              justify={"center"}
                              style={{ alignItems: "baseline" }}
                            >
                              <Col>
                                <Form.Item name={[index]}>
                                  {item.type === "single" ? (
                                    <Radio.Group>
                                      {item.options.map((option) => (
                                        <Radio
                                          disabled={readonly}
                                          key={option._id}
                                          value={option._id}
                                        >
                                          {String.fromCharCode(
                                            65 + item.options.indexOf(option)
                                          )}
                                        </Radio>
                                      ))}
                                    </Radio.Group>
                                  ) : (
                                    <Checkbox.Group>
                                      {item.options.map((option) => (
                                        <Checkbox
                                          disabled={readonly}
                                          key={option._id}
                                          value={option._id}
                                        >
                                          {String.fromCharCode(
                                            65 + item.options.indexOf(option)
                                          )}
                                        </Checkbox>
                                      ))}
                                    </Checkbox.Group>
                                  )}
                                </Form.Item>
                              </Col>
                              {!readonly ? (
                                <Col>
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      resetQuestion(index);
                                    }}
                                    shape="circle"
                                    icon={<ReloadOutlined />}
                                    size="small"
                                  ></Button>
                                </Col>
                              ) : null}
                            </Row>
                          </Col>
                        </Row>
                      </Space>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
        </Form.List>
        {!readonly ? (
          <>
            <Divider />
            <Row gutter={[20, 20]} justify={"space-between"}>
              <Col>{ResetAnswerButton}</Col>
              <Col>
                {" "}
                <Form.Item>
                  <Button
                    block={isMobile}
                    loading={submittingResponses}
                    type="primary"
                    htmlType="submit"
                  >
                    Save Answers
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </>
        ) : null}
      </Form>
    </Spin>
  );
};

export default OMRComponent;

export const OMRSKeleton = () => {
  const SkelArray = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  return (
    <Row style={{ marginTop: 30 }}>
      <Col xs={0} sm={0} md={2} />
      <Col xs={24} sm={24} md={20}>
        <Row gutter={[20, 30]}>
          <Col span={24}>
            <Skeleton.Button active block size="large" />
          </Col>
          <Col span={24}>
            <Card
              title={
                <Skeleton.Button
                  style={{ height: 15, width: 15 }}
                  active
                  block
                  size="large"
                />
              }
            >
              <Row gutter={[30, 20]}>
                {SkelArray.map(() => (
                  <Col span={12}>
                    <Row justify={"space-between"}>
                      {/* <Col>
      <Skeleton.Button style={{width:20,height: 20}} shape='circle' />
    </Col> */}
                      <Col>
                        <Row gutter={[30, 20]}>
                          {SkelArray.map(() => (
                            <Col>
                              <Skeleton.Avatar
                                active
                                style={{ width: 20, height: 20 }}
                                shape="circle"
                              />
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xs={0} sm={0} md={2} />
    </Row>
  );
};
