"use client";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Skeleton,
  Space,
  Tag,
  message,
} from "@Lib/index";
import {
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  InfoOutlined,
  WalletOutlined,
  WalletTwoTone,
} from "@ant-design/icons";
import {
  Constants,
  Enum,
  Learner,
  Store,
  Types,
  Utils,
} from "@adewaskar/lms-common";
import { Fragment, useMemo } from "react";
import { Link, useNavigate, useParams } from "@Router/index";

import ActionDrawer from "@Components/ActionDrawer";
import ActionModal from "@Components/ActionModal/ActionModal";
import CompletedLiveTestCard from "./CompleteLiveTestMetadata";
import CompletedTestCard from "./CompletedTestMetadata";
import Countdown from "@Components/Countdown";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import Image from "@Components/Image";
import LearnerLogin from "@Learner/Screens/Login";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import PriceCardContent from "@Learner/Screens/StoreScreen/Cards/PriceCardContent";
import ProductCheckoutButton from "@Components/CheckoutButton";
import ProductWalletNudge from "@Components/ProductWalletNudge";
import SkeletonImage from "@Components/SkeletonImage";
import TestMetadata from "./TestMetadata";
import TestTimeCountdown from "@Components/TestTimeCountdown";
import Title from "antd/es/typography/Title";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { useQueryClient } from "@tanstack/react-query";
import TestDetailSkeletonScreen from "./TestDetailSkeletonScreen";
import { FAQsList } from "@Components/CreateFaqsComponent";
import { ProductDetailSignup } from "../../../StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { LogEvent } from "@ServerHooks/useDehydration";

const { Text, Paragraph } = Typography;
const { UnitTypeToStr } = Utils;

interface TestDetailScreenPropsI {
  isServer?: boolean;
}

export default function TestDetailScreen(props: TestDetailScreenPropsI) {
  const { testId } = useParams();
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(testId + "");
  // console.log(testId, "test");

  const { data: enrolledDetails, isFetching: loadingEnrolledTest } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: test._id + "",
    });

  const plan =
    (test.plan as unknown as Types.Plan) ||
    Constants.INITIAL_COURSE_PLAN_DETAILS;
  const testEndDate =
    enrolledDetails.metadata.test.endedAt || test.live.endedAt;
  const Metadata = testEndDate ? (
    <>
      {loadingEnrolledTest ? (
        <Skeleton paragraph={{ rows: 8 }} />
      ) : (
        <CompletedTestCard test={test} />
      )}
    </>
  ) : (
    <TestMetadata test={test} />
  );

  const hideLandingPage = test?.landingPage?.description?.length < 200;
  return loadingEnrolledTest || loadingTest ? (
    <TestDetailSkeletonScreen />
  ) : (
    <Row gutter={[20, 30]}>
      <ProductDetailSignup
        product={{
          type: "category",
          id: test.category,
        }}
      />
      {loadingTest ? null : (
        <>
          <Col md={24} sm={24} lg={0}>
            <TestCard
              isServer={props.isServer}
              plan={plan}
              testId={testId + ""}
            />
            {/* Replace with card image */}
            {/* <CourseMetadata course={course} /> */}
          </Col>
          <Col lg={24} md={24} xs={0}>
            <Title
              style={{
                // fontSize: 16,
                whiteSpace: "normal", // Ensures text wraps
                overflowWrap: "break-word", // Breaks words to prevent overflow
                textAlign: hideLandingPage ? "center" : "left",
              }}
              level={3}
            >
              {test.title}
            </Title>
            <Title
              style={{
                // fontSize: 16,
                whiteSpace: "normal", // Ensures text wraps
                overflowWrap: "break-word", // Breaks words to prevent overflow
                textAlign: hideLandingPage ? "center" : "left",
              }}
              level={5}
            >
              {test.subtitle}
            </Title>
          </Col>
        </>
      )}

      <Col span={24}>
        <Row
          style={{
            display: "flex",
            justifyContent: hideLandingPage ? "center" : "start",
          }}
          gutter={[30, 30]}
        >
          {!hideLandingPage ? (
            <Col xs={24} sm={24} md={24} lg={16}>
              {loadingTest ? (
                <Skeleton
                  style={{ marginBottom: 30 }}
                  active
                  paragraph={{ rows: 1 }}
                />
              ) : null}
              <Card style={{ paddingTop: 0 }}>
                <Row>
                  {test.landingPage?.promoVideo?.url ? (
                    <Col span={24}>
                      <MediaPlayer
                        thumbnail={test.landingPage.promoVideo.thumbnailImage}
                        height={400}
                        url={test.landingPage.promoVideo.url}
                      />
                      <Divider />
                    </Col>
                  ) : null}
                  <Col span={24}>
                    {loadingTest ? (
                      <Row>
                        <Col span={24}>
                          {/* <Skeleton active paragraph={{ rows: 1 }} /> */}
                          <SkeletonImage
                            active
                            style={{ flex: 1, height: 400 }}
                          />
                          <Skeleton active paragraph={{ rows: 20 }} />
                        </Col>
                      </Row>
                    ) : (
                      <Paragraph style={{ fontSize: 16 }}>
                        <HtmlViewer content={test.landingPage.description} />
                      </Paragraph>
                    )}
                  </Col>
                  {test?.faqs?.length ? (
                    <Col span={24}>
                      <Card title="FAQs">
                        <FAQsList faqs={test.faqs} />
                      </Card>
                    </Col>
                  ) : null}
                </Row>
              </Card>
            </Col>
          ) : null}
          <Col xs={0} sm={0} md={0} lg={8}>
            <TestCard
              isServer={props.isServer}
              testId={testId + ""}
              //  @ts-ignore
              plan={test.plan}
            >
              {Metadata}
            </TestCard>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const TestCard = ({
  testId,
  isServer,
  plan,
  children,
}: {
  testId: string;
  isServer?: boolean;
  plan: Types.Plan;
  children?: React.ReactNode;
}) => {
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(testId + "");

  const product = { type: Enum.ProductType.TEST, id: test._id };
  const navigate = useNavigate();
  const {
    data: { wallet },
  } = Learner.Queries.useGetLearnerDetails();
  const { data: enrolledDetails, isFetching: loadingEnrolledTestDetails } =
    Learner.Queries.useGetEnrolledProductDetails(product);
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(product);
  const testEndDate =
    enrolledDetails.metadata.test.endedAt || test.live.endedAt;
  const testStartDate =
    enrolledDetails.metadata.test.startedAt || test.live.startedAt;
  const {
    data: { status },
    isFetching: loadingResult,
  } = Learner.Queries.useGetTestResult(testId + "", {
    enabled: !!testEndDate,
  });
  const { mutate: retryTest, isLoading: retryingTest } =
    Learner.Queries.useRetryTest(test._id + "");
  // console.log(testEndDate,'testEndDate')
  const Metadata = testEndDate ? (
    test.live.enabled ? (
      <CompletedLiveTestCard test={test} />
    ) : (
      <CompletedTestCard test={test} />
    )
  ) : (
    <TestMetadata test={test} />
  );
  const ENROLLED_CTA = useMemo(() => {
    if (loadingEnrolledTestDetails || (testEndDate && loadingResult)) {
      return (
        <>
          <Skeleton.Button size="large" active block />
          <Skeleton.Button
            style={{ marginTop: 10 }}
            size="large"
            active
            block
          />{" "}
        </>
      );
    }
    if (test.live.enabled) {
      if (testEndDate) {
        return (
          <Alert
            style={{ marginBottom: 20 }}
            message={`Your test was submitted successfully`}
            type="success"
            showIcon
          />
        );
      }
      switch (test.status) {
        case Enum.TestStatus.PUBLISHED: {
          return (
            <Alert
              style={{ marginBottom: 20 }}
              message={
                <span>
                  Test will begin in{" "}
                  <Countdown targetDate={test.live.scheduledAt} />
                </span>
              }
              type="success"
              showIcon
            />
          );
          break;
        }

        case Enum.TestStatus.IN_PROGRESS: {
          return (
            <Fragment>
              <Alert
                style={{ marginBottom: 20 }}
                message="Test has started"
                action={
                  <span>
                    Time left: <TestTimeCountdown testId={testId} />{" "}
                  </span>
                }
                type="info"
                showIcon
                // action={ }
              />
              <Button
                size="large"
                onClick={() => navigate("start")}
                block
                type="primary"
              >
                Join Test
              </Button>
            </Fragment>
          );
          break;
        }

        case Enum.TestStatus.ENDED: {
          return (
            <Alert
              style={{ marginBottom: 20 }}
              message="The test has ended"
              type="error"
              showIcon
            />
          );
          break;
        }
      }
    } else {
      // console.log(enrolledDetails.metadata.test, 'enrolledDetails')
      if (!testStartDate) {
        return (
          <Button
            size="large"
            onClick={() => {
              LogEvent("Test", "Start Test::Clicked", `${test.title}}`, {
                testId: test._id,
                clickedFrom: "TestDetail",
              });
              navigate(`/app/test/${testId}/start`);
            }}
            block
            type="primary"
          >
            <EditOutlined /> Start Test
          </Button>
        );
      }
      if (testStartDate) {
        if (testEndDate) {
          if (status === Enum.TestResultStatus.EVALUATED) {
            return (
              <>
                <Alert
                  style={{ marginBottom: 20 }}
                  message="You have attended this test."
                  type="success"
                  showIcon
                  action={
                    <Button
                      size="small"
                      onClick={() => navigate(`/app/test/${testId}/result`)}
                    >
                      View Result
                    </Button>
                  }
                />
                <Button
                  size="large"
                  onClick={() => navigate(`/app/test/${testId}/review`)}
                  type="primary"
                  block
                >
                  View solutions
                </Button>
                <Button
                  danger
                  style={{ marginTop: 10 }}
                  loading={retryingTest}
                  size="large"
                  onClick={() =>
                    retryTest(undefined, {
                      onSuccess: () => {
                        message.open({
                          type: "success",
                          content: "All the best!",
                        });
                        navigate(`/app/test/${testId}/start`);
                      },
                    })
                  }
                  type="primary"
                  block
                >
                  Retry Test
                </Button>
              </>
            );
          } else {
            return (
              <>
                <Alert
                  style={{ marginBottom: 20 }}
                  message="Test result is under evaluation"
                  type="success"
                  showIcon
                />
              </>
            );
          }
        } else {
          return (
            <Button
              size="large"
              onClick={() => navigate(`/app/test/${test._id}/start`)}
              block
              type="primary"
            >
              <EditOutlined /> Continue Test
            </Button>
          );
        }
      }
    }
  }, [test, enrolledDetails, status]);
  const isSignedIn = Store.useAuthentication((s) => s.isSignedIn);
  const { isMobile, isDesktop, isTablet } = useBreakpoint();
  const isFree = plan.type === "free";
  const isLoading = loadingTest;
  const { openModal } = useModal();
  return (
    <Card
      bodyStyle={{ padding: 10, paddingBottom: 20 }}
      // style={{ height: '100%' }}
      title={
        !isDesktop ? (
          <Text
            style={{
              fontSize: 16,
              whiteSpace: "normal", // Ensures text wraps
              overflowWrap: "break-word", // Breaks words to prevent overflow
            }}
          >
            {test.title}
          </Text>
        ) : null
      }
      extra={
        isMobile || isTablet ? (
          <ActionDrawer
            title={test.title}
            cta={<Button shape="circle" icon={<InfoOutlined />}></Button>}
          >
            {" "}
            {Metadata}{" "}
          </ActionDrawer>
        ) : null
      }
    >
      {" "}
      {isLoading ? (
        <>
          <Row gutter={[20, 10]}>
            <Col span={24}>
              <SkeletonImage style={{ flex: 1, height: 200 }} />
            </Col>
            <Col span={24}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Col>
            <Col span={24}>
              <Skeleton.Button size="large" active block />
            </Col>
          </Row>
        </>
      ) : (
        <>
          {" "}
          <Row gutter={[20, 40]} align="stretch">
            {test.thumbnailImage ? (
              <Col span={24}>
                <Image
                  width={"100%"}
                  height={200}
                  preview={false}
                  alt={test.title}
                  src={test.thumbnailImage}
                />
              </Col>
            ) : null}
            <Col span={24} flex={1}>
              {!isEnrolled ? (
                <Col span={24}>
                  {!test?.pyq?.enabled ? (
                    <>
                      <PriceCardContent plan={plan} />
                      {!isMobile ? <Divider /> : null}
                    </>
                  ) : null}
                </Col>
              ) : null}
              <Col span={24}>
                <Row gutter={[10, 10]}>
                  <Col span={24}>{children}</Col>
                  <Col span={24}>
                    {isSignedIn ? (
                      <>
                        {isEnrolled ? (
                          ENROLLED_CTA
                        ) : (
                          <ProductCheckoutButton
                            // onClick={() => {
                            //   LogEvent(
                            //     "Enroll Test Button",
                            //     "Click",
                            //     test.title
                            //   );
                            // }}
                            onSuccess={() => {
                              message.open({
                                type: "success",
                                content: `You have enrolled successfully`,
                              });
                            }}
                            product={{ type: "test", id: testId + "" }}
                            block
                            type="primary"
                          >
                            {isFree
                              ? test?.pyq?.enabled
                                ? "Attempt Now"
                                : "Enroll Now"
                              : "Buy Now"}
                          </ProductCheckoutButton>
                        )}
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          openModal(<LearnerLogin />, {
                            width: 300,
                          });
                        }}
                        size="large"
                        type="primary"
                        block
                      >
                        Login to access this test
                      </Button>
                    )}

                    {test?.pyq?.enabled ? (
                      <Link
                        to={
                          isServer
                            ? `/test/${testId}/previous-year-questions`
                            : `/app/test/${testId}/previous-year-questions`
                        }
                      >
                        <Button
                          style={{ marginTop: 15 }}
                          danger
                          size="large"
                          block
                          type="dashed"
                        >
                          <BookOutlined /> View Detailed Solution
                        </Button>
                      </Link>
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};
