"use client";

import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Timeline,
  message,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Enum, Learner } from "@adewaskar/lms-common";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "@Router/index";

import ActionDrawer from "@Components/ActionDrawer";
import ActionModal from "@Components/ActionModal/ActionModal";
// import AnswerSheetFiles from './TestPlayerItem/OMR/AnswerSheetFiles'
import Countdown from "@Components/Countdown";
import Header from "@Components/Header";
import { NavLink } from "@Router/index";
const AnswerSheetFiles = React.lazy(
  () => import("./TestPlayerItem/OMR/AnswerSheetFiles")
); // Lazy-loaded content
// import OMRComponent from './TestPlayerItem/OMR/OMRComponent'
const OMRComponent = React.lazy(
  () => import("./TestPlayerItem/OMR/OMRComponent")
); // Lazy-loaded content
import ProctoringComponent from "@Learner/Screens/Procturing/TestProcturing";
import TestItemSkeleton from "../TestReview/TestItemSkeleton";
import TestQuestionNavigator from "./TestQuestionNavigator/TestQuestionNavigator";
import TestTimeCountdown from "@Components/TestTimeCountdown";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import { openWindow, useText } from "@Components/Editor/SunEditor/utils";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useModal } from "@Components/ActionModal/ModalContext";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { LogEvent } from "@ServerHooks/useDehydration";

const { confirm } = Modal;

interface TestPlayerPropsI {
  // testId: string;
  // questionId: string;
  // children: React.ReactNode;
}

const { Title } = Typography;

export default function TestPlayer(props: TestPlayerPropsI) {
  const { testId, questionId } = useParams();
  const navigate = useNavigate();
  const { mutate: endTest, isLoading: submittingTest } =
    Learner.Queries.useEndTest(testId + "");
  const { data: test } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.TEST
  );
  const { data: enrolledProduct, isLoading: loadingDetails } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: test._id + "",
    });

  const isProcturingOn = test.rules.procturing.enabled;
  const {
    data: {
      status: { startedAt, hasStarted, hasEnded, sections },
    },
    isLoading: loadingStatus,
  } = Learner.Queries.useGetTestStatus(testId + "");

  useEffect(() => {
    // console.log(test.sections, "test.sections");
    if (test.sections[0]?.items[0] && !questionId) {
      const itemId = test.sections[0].items[0]._id;
      navigate(`/app/test/${testId}/player/${itemId}`);
    }
  }, [test.sections]);

  const testEndTime = enrolledProduct?.metadata?.test?.endedAt;
  const { openModal } = useModal();
  const { isTablet, isDesktop, isMobile } = useBreakpoint();
  const qc = useQueryClient();
  const { FormatLangText } = useText(enrolledProduct.metadata.test.language);
  const AnswerSheetButton = (
    <ActionModal
      minHeight={500}
      lazy
      width={800}
      cta={
        <Button block={isMobile} type="primary">
          {FormatLangText('ANSWER_SHEET')}
        </Button>
      }
      title={
        <Row
          style={{ marginTop: 25 }}
          justify={"space-between"}
          align={"middle"}
        >
          <Col>
            <Title level={4}>
              {FormatLangText('ANSWER_SHEET')}
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                if (isMobile) {
                  openWindow(
                    `/app/test/${testId}/upload-answer-sheet`,
                    (refetchTestStatus: boolean) => {
                      // debugger;
                      if (refetchTestStatus) {
                        message.open({
                          type: "success",
                          content: `Answer Sheet Recorded successfully`,
                        });
                        qc.invalidateQueries([`GET_TEST_STATUS`, testId]);
                      }
                    }
                  );
                } else {
                  openModal(<AnswerSheetFiles testId={testId + ""} />);
                }
              }}
            >
              {FormatLangText('UPLOAD_ANSWER_SHEET')}
            </Button>
          </Col>
        </Row>
      }
    >
      <OMRComponent testId={testId + ""} />
    </ActionModal>
  );
  // const AnswerSheetButton = <Button
  //   onClick={() => openModal(<OMRComponent testId={testId + ''} />, {
  //     width: 800,
  //     title: <Row style={{marginTop:25}} justify={'space-between'} align={'middle'}>
  //       <Col><Title level={4}>Answer Sheet </Title></Col><Col>
  //         <ActionModal cta={<Button onClick={() => {
  //           openModal(<AnswerSheetFiles testId={testId+''} />)
  //         }} type='primary' >Upload Answer Sheet</Button>}>
  //     <AnswerSheetFiles testId={testId+''} /></ActionModal></Col>
  //     </Row>
  //   })}
  //   icon={<BookOutlined />}
  // block={!isDesktop} style={{ marginRight: 10 }} type='primary'>Answer Sheet</Button>
  const language = enrolledProduct.metadata.test.language;
  const SubmitTestButton = (
    <Button
      block={!isDesktop}
      onClick={() => {
        LogEvent("Test", "End Test::Clicked", `${test.title}}`, {
          testId: test._id,
          clickedFrom: "Test Player",
        });
        // @ts-ignore
        const markCount = sections
          .map((a) => a.items)
          .flat()
          .filter((i) => i.isMarked).length;
        confirm({
          title: "Are you sure?",
          // icon: <ExclamationCircleOutlined />,
          content: YOU_HAVE_MARKED(markCount)[language] || YOU_HAVE_MARKED(markCount)['eng'],
          onOk() {
            endTest(undefined, {
              onSuccess: () => {
                LogEvent("Test", "End Test::Success", `${test.title}}`, {
                  testId: test._id,
                  clickedFrom: "Test Player",
                });
                navigate(`/app/test/${testId}/completed`);
              },
            });
          },
          okText: FormatLangText('YES_SUBMIT'),
        });
      }}
      type="primary"
      danger
      loading={submittingTest}
      id='submit-test-button'
    >
      {FormatLangText('SUBMIT_TEST')}
    </Button>
  );
  const targetDate = dayjs(startedAt)
    .add(test.duration.value, "minutes")
    .toString();
  const CountdownComponent = test.duration.enabled ? (
    <Tag icon={<ClockCircleOutlined />} color="blue">
      <Countdown targetDate={targetDate} />
    </Tag>
  ) : null;

  const QuestionNavigator = TestQuestionNavigator;
  if (testEndTime) {
    return (
      <Header
        // style={{
        //   paddingRight: 0,
        //   paddingTop: 10,
        // }}
        title={test.title}
        extra={
          <NavLink title={"Back"} to={"../"}>
            <Button type="primary">Go Back</Button>
          </NavLink>
        }
      >
        <Card>
          <Title style={{ textAlign: "center" }}>Test has ended.</Title>
        </Card>
      </Header>
    );
  }
  const isLoading = loadingStatus;
  const SideDrawer = (
    <ActionDrawer
      extra={() => [CountdownComponent]}
      footer={() => [
        // UpdatingTestStatus,
        SubmitTestButton,
      ]}
      cta={<Button icon={<MenuOutlined />}></Button>}
    >
      <div
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          marginBottom: 15,
          marginTop: 15,
        }}
      >
        {AnswerSheetButton}
      </div>
      <QuestionNavigator questionId={questionId + ""} testId={testId + ""} />
    </ActionDrawer>
  );
  return (
    <Header
      style={{
        paddingRight: 10,
        paddingTop: 10,
      }}
      title={!isMobile ? test.title : CountdownComponent}
      subTitle={"asd"}
      extra={
        <Row>
          {!isDesktop ? <Col></Col> : null}
          <Col>
            {!isDesktop ? (
              SideDrawer
            ) : (
              <>
                {isLoading ? (
                  <Row>
                    <Col style={{ marginRight: 15 }}>
                      <Skeleton.Button
                        active
                        style={{ width: 135, height: 32 }}
                      />
                    </Col>
                    <Col>
                      <Skeleton.Button
                        active
                        style={{ width: 98, height: 32 }}
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col style={{ marginRight: 15 }}>{AnswerSheetButton}</Col>
                    <Col>{SubmitTestButton}</Col>
                  </Row>
                )}
              </>
            )}
          </Col>
        </Row>
      }
    >
      {isProcturingOn ? (
        <>
          <ProctoringComponent />{" "}
          <Alert
            style={{ marginBottom: 50 }}
            message="Please Note: This exam is being proctured. Any suspicious activity will be reported and submit the test immediately."
            type="info"
            showIcon
          />
        </>
      ) : null}

      <Row>
        <Col xs={0} sm={1} />
        <Col xs={24} sm={22}>
          <Row gutter={[50, 30]}>
            <Col xs={24} sm={24} md={24} lg={16}>
              {isLoading ? <TestItemSkeleton /> : <Outlet />}
            </Col>
            {isDesktop ? (
              <Col lg={8} md={0}>
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <QuestionNavigator
                      questionId={questionId + ""}
                      testId={testId + ""}
                    />
                  </Col>
                </Row>
              </Col>
            ) : null}
          </Row>
        </Col>
        <Col xs={0} sm={1} />
      </Row>
    </Header>
  );
}

export const SubmitButton = ({ testId }: { testId: string }) => {
  const navigate = useNavigate();
  const { mutate: endTest, isLoading: submittingTest } =
    Learner.Queries.useEndTest(testId + "");
  const { data: test } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.TEST
  );
  const { data: enrolledProduct, isLoading: loadingDetails } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: test._id + "",
    });
  const { FormatLangText } = useText(enrolledProduct.metadata.test.language);
  const { isTablet, isDesktop, isMobile } = useBreakpoint();
  const {
    data: {
      status: { startedAt, hasStarted, hasEnded, sections },
    },
    isLoading: loadingStatus,
  } = Learner.Queries.useGetTestStatus(testId + "");
  return (
    <Button
      block={!isDesktop}
      onClick={() => {
        LogEvent("Test", "End Test::Clicked", `${test.title}}`, {
          testId: test._id,
          clickedFrom: "Test Player",
        });
        // @ts-ignore
        const markCount = sections
          .map((a) => a.items)
          .flat()
          .filter((i) => i.isMarked).length;
        confirm({
          title: "Are you sure?",
          // icon: <ExclamationCircleOutlined />,
          content: markCount
            ? `You have marked ${markCount} question${markCount > 1 ? "s" : ""
            } for review. Are you sure you want to submit? You will not able able to resubmit the test.`
            : `You want to submit this test? You will not be able to resubmit the test.`,
          onOk() {
            endTest(undefined, {
              onSuccess: () => {
                LogEvent("Test", "End Test::Success", `${test.title}}`, {
                  testId: test._id,
                  clickedFrom: "Test Player",
                });
                navigate(`/app/test/${testId}/completed`);
              },
            });
          },
          okText: FormatLangText('YES_SUBMIT'),
        });
      }}
      type="primary"
      danger
      id='submit-test-button'
      loading={submittingTest}
    >
      {FormatLangText('SUBMIT_TEST')}
    </Button>
  );
};


const YOU_HAVE_MARKED = (markCount) => {
  return {
    eng: markCount
      ? `You have marked ${markCount} question${markCount > 1 ? 's' : ''} for review. Are you sure you want to submit? You will not be able to resubmit the test.`
      : `Do you want to submit this test? You will not be able to resubmit the test.`,

    hin: markCount
      ? `आपने ${markCount} प्रश्न को समीक्षा के लिए चिह्नित किया है। क्या आप वाकई इसे जमा करना चाहते हैं? आप दोबारा इस परीक्षा को जमा नहीं कर पाएंगे।`
      : `क्या आप इस परीक्षा को जमा करना चाहते हैं? आप इसे दोबारा जमा नहीं कर पाएंगे।`,

    guj: markCount
      ? `તમે ${markCount} પ્રશ્ન${markCount > 1 ? 'ો' : ''} સમીક્ષા માટે ચિહ્નિત કર્યા છે. શું તમે ખરેખર પરીક્ષા સબમિટ કરવા માંગો છો? તમે ફરીથી આ પરીક્ષા સબમિટ કરી શકશો નહીં.`
      : `શું તમે આ પરીક્ષા સબમિટ કરવા માંગો છો? તમે ફરીથી સબમિટ કરી શકશો નહીં.`
  }
}