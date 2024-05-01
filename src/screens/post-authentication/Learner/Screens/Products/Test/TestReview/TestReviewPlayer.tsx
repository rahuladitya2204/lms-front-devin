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
} from "@Lib/index";
import {
  ArrowLeftOutlined,
  LogoutOutlined,
  MenuOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Enum, Learner, Store } from "@adewaskar/lms-common";
import { Fragment, useEffect, useMemo } from "react";

import { useNavigate, useParams, NavLink } from "@Router/index";

import ActionDrawer from "@Components/ActionDrawer";
import Header from "@Components/Header";
import ProctoringComponent from "@Learner/Screens/Procturing/TestProcturing";
import TestItemSkeleton from "./TestItemSkeleton";
import TestPlayerMoreInfo from "./TestPlayerMoreInfo";
import TestReviewQuestionNavigator from "./TestQuestionReviewNavigator";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useReviewQuestion } from "./useReviewQuestion";
import { Outlet } from "react-router";

// const ProctoringComponent = lazy(() => import('@Learner/Screens/Procturing/TestProcturing'));

const { confirm } = Modal;

interface TestPlayerPropsI {
  isReview?: boolean;
  // children: React.ReactNode;
}

const { Title, Text } = Typography;

export default function TestReviewPlayer(props: TestPlayerPropsI) {
  const { testId, questionId } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const unlisten = navigate((location, action) => {
  //     if (action === 'POP') {
  //       // The back button was pressed
  //       console.log('Back button was pressed.');
  //       // Perform any additional actions
  //     }
  //   });

  //   // Clean up the listener when the component unmounts
  //   return unlisten;
  // }, [navigate, location]);
  const { mutate: endTest, isLoading: submittingTest } =
    Learner.Queries.useEndTest(testId + "");
  const { data: test, isLoading } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.RESULT
  );
  const { data: enrolledProduct, isLoading: loadingEnrolledProduct } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: test._id + "",
    });

  const isProcturingOn = test.rules.procturing.enabled;

  useEffect(() => {
    if (test.sections[0]?.items[0] && !questionId) {
      const itemId = test.sections[0].items[0]._id;
      navigate(`/app/test/${testId}/review/${itemId}`);
    }
  }, [test.sections, questionId]);

  const endTestNow =
    enrolledProduct.metadata.test.endedAt ||
    enrolledProduct.metadata.test.submittedAt;

  if (endTestNow) {
    // navigate('../completed')
  }
  const testEndTime =
    enrolledProduct.metadata.test.endedAt || test.live.endedAt;

  const { isTablet, isDesktop, isMobile } = useBreakpoint();
  const { currentQuestion } = useReviewQuestion();
  const ExitButton = (
    <Button
      style={{ width: isDesktop ? 100 : "100%" }}
      block={!isDesktop}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          // icon: <ExclamationCircleOutlined />,
          content: `You want to exit reviewing?`,
          onOk() {
            if (enrolledProduct.package) {
              navigate(
                `/app/test-series/${enrolledProduct.package}/enrolled-package`
              );
            } else {
              navigate(`/app/test/${testId}`);
            }
          },
          okText: "Yes, Exit",
        });
      }}
      icon={<LogoutOutlined />}
      type="primary"
      danger
      loading={submittingTest}
    >
      Exit
    </Button>
  );
  const QuestionNavigator = TestReviewQuestionNavigator;
  const SideDrawer = (
    <ActionDrawer
      footer={() => [
        // UpdatingTestStatus,
        // ExitButton,
      ]}
      cta={<Button icon={<MenuOutlined />}></Button>}
    >
      <QuestionNavigator questionId={questionId + ""} testId={testId + ""} />
    </ActionDrawer>
  );
  return (
    <Header
      title={
        <Space>
          {" "}
          <NavLink title={test.title} to={`/app/test/${testId}/result`}>
            <Button type="primary" icon={<ArrowLeftOutlined />}></Button>
          </NavLink>{" "}
          {!isMobile ? test.title : null}
        </Space>
      }
      subTitle={"asd"}
      extra={
        isDesktop
          ? [
              <Tag style={{ marginRight: 30 }}>
                Submitted at {dayjs(testEndTime).format("LLL")}
              </Tag>,
              // ExitButton,
            ]
          : SideDrawer
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
        <Col span={1} />
        <Col span={22}>
          <Row gutter={[50, 30]}>
            <Col xs={24} lg={isDesktop ? 16 : 24}>
              {isLoading ? (
                <TestItemSkeleton />
              ) : (
                <Fragment>
                  <Outlet />
                  <TestPlayerMoreInfo itemId={questionId + ""} test={test} />
                </Fragment>
              )}
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
        <Col span={1} />
      </Row>
    </Header>
  );
}
