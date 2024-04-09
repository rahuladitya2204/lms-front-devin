"use client";

import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  List,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  notification,
} from "@Lib/index";
import { Constants, Learner, Store } from "@adewaskar/lms-common";
import { TERMS, TEST_RULES } from "./constant";
import { useNavigate, useParams } from "@Router/index";

import ActionModal from "@Components/ActionModal/ActionModal";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Countdown from "@Components/Countdown";
import Header from "@Components/Header";
import IDVerificationComponent from "@Learner/Screens/Procturing/hooks/IDVerification/IDVerificationComponent";
import TestTimeCountdown from "@Components/TestTimeCountdown";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useEffect } from "react";
import { useModal } from "@Components/ActionModal/ModalContext";

const { Title, Text } = Typography;

interface TestRulesPropsI {
  // testId?: string;
}

export default function TestRules(props: TestRulesPropsI) {
  const { testId } = useParams();
  const {} = Learner.Queries.useGetLearnerDetails();
  const { mutate: startTest, isLoading: startingTest } =
    Learner.Queries.useStartTest(testId + "");
  const { data: test } = Learner.Queries.useGetTestDetails(testId + "");
  const {
    data: {
      status: { hasEnded, hasStarted },
    },
  } = Learner.Queries.useGetTestStatus(testId + "");
  const { data: enrolledProduct, isLoading: loadingEnrolledTest } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: "test",
      id: testId + "",
    });
  console.log(props, enrolledProduct, "propsprops");
  const isVerificationOn = test.rules.identityVerification.enabled;
  const [form] = Form.useForm();
  const rule1 = Form.useWatch("rule-1", form);
  const rule2 = Form.useWatch("rule-2", form);
  const rule3 = Form.useWatch("rule-3", form);
  const language = Form.useWatch("language", form);
  const isValid =
    test._id &&
    rule1 &&
    rule2 &&
    rule3 &&
    (test.languages.length > 1 ? language : true);
  const testStartDate =
    enrolledProduct.metadata.test.startedAt || test.live.startedAt;
  const testEndDate =
    enrolledProduct.metadata.test.endedAt || test.live.endedAt;
  const endingAt = test.duration.enabled
    ? dayjs(enrolledProduct.metadata.test.startedAt)
        .add(test.duration.value, "minutes")
        .toString()
    : null;
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const isAliasValid = Store.useGlobal((s) => s.isAliasValid);
  console.log(isAliasValid, "isAliasValidisAliasValid");
  const onSubmit = async () => {
    try {
      const data = await form.validateFields();
      startTest(
        {
          language: data.language,
        },
        {
          onSuccess: () => {
            console.log("Helo");
            navigate(`/app/test/${testId}/player`);
          },
        }
      );
    } catch (er) {
      console.log(er, "eeerrr");
    }
  };

  useEffect(() => {
    if (test.languages.length <= 1) {
      form.setFieldValue(["language"], test.languages[0]);
    }
  }, [test.languages]);
  const { openModal } = useModal();

  return (
    <Spin spinning={loadingEnrolledTest}>
      <Header
        title={
          <span>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                if (enrolledProduct.package) {
                  navigate(
                    `/app/package/${enrolledProduct.package}/enrolled-package`
                  );
                } else {
                  navigate(`/app/test/${testId}`);
                }
              }}
            />{" "}
            {test.title}
          </span>
        }
        extra={
          !isMobile
            ? [
                hasStarted ? (
                  testStartDate && endingAt ? (
                    <Tag color="blue">
                      Time Left: <TestTimeCountdown testId={testId + ""} />
                    </Tag>
                  ) : null
                ) : test.duration.enabled ? (
                  <Tag color="blue-inverse">
                    Time Limit: {test.duration.value} mins
                  </Tag>
                ) : null,
              ]
            : null
        }
      >
        <Row gutter={[20, 20]}>
          <Col xs={1} md={4} />
          <Col xs={22} md={16}>
            <Row>
              <Col span={24}>
                <Title style={{ textAlign: "center" }}>Online Assesment</Title>
                <List
                  itemLayout="horizontal"
                  dataSource={TEST_RULES}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta title={item.rule} />
                    </List.Item>
                  )}
                />
              </Col>
              <Divider />
              <Col span={24}>
                <Title level={4}>Term & Pledges</Title>
                <Form onFinish={onSubmit} layout="vertical" form={form}>
                  {TERMS.map(({ term, termId }) => {
                    return (
                      <Form.Item name={termId} valuePropName="checked">
                        <Checkbox>{term}</Checkbox>
                      </Form.Item>
                    );
                  })}
                  <Form.Item
                    style={{
                      display: test.languages.length > 1 ? "block" : "none",
                    }}
                    rules={[{ required: true }]}
                    label="Select Language"
                    name="language"
                  >
                    <Select
                      style={{ width: isMobile ? "100%" : 180 }}
                      placeholder="Select your preferred Language"
                      options={Constants.LANGUAGES.filter((lang) =>
                        // @ts-ignore
                        test.languages.includes(lang.value)
                      ).map((l) => {
                        return {
                          label: l.label,
                          value: l.value,
                        };
                      })}
                    />
                  </Form.Item>
                  {/* <Divider /> */}
                  <Row
                    align={"middle"}
                    style={{ display: "flex", flexDirection: "row-reverse" }}
                  >
                    <Col flex={isMobile ? 1 : "reverse"}>
                      {!isVerificationOn ? (
                        <Button
                          disabled={!isValid}
                          style={{
                            width: !isMobile ? 150 : "100%",
                            display: "inline-block",
                          }}
                          type="primary"
                          loading={startingTest}
                          onClick={form.submit}
                        >
                          {testStartDate && !testEndDate
                            ? "Continue Test"
                            : "Start Test"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            openModal(
                              <IDVerificationComponent
                                onMatch={() => {
                                  notification.success({
                                    message: "Success",
                                    description: "ID Verified!",
                                  });
                                  form.submit();
                                }}
                              />
                            );
                          }}
                          disabled={!isValid}
                          style={{ marginLeft: 20, width: 200 }}
                          type="primary"
                        >
                          Verify and Start Test
                        </Button>
                        // <ActionModal
                        //   cta={
                        //     <Button
                        //       disabled={!isValid}
                        //       style={{ marginLeft: 20, width: 200 }}
                        //       type="primary"
                        //     >
                        //       Verify and Start Test
                        //     </Button>
                        //   }
                        // >
                        //   <IDVerificationComponent
                        //     onMatch={() => {
                        //       notification.success({
                        //         message: 'Success',
                        //         description: 'ID Verified!'
                        //       })
                        //       form.submit()
                        //     }}
                        //   />
                        // </ActionModal>
                      )}
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col xs={1} md={4} />
        </Row>
      </Header>
    </Spin>
  );
}
