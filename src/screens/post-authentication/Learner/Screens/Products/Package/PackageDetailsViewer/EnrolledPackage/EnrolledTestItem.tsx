import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Image,
  List,
  Progress,
  Row,
  Space,
  Tag,
  message,
} from "@Lib/index";
import {
  CheckCircleOutlined,
  CheckOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import { Enum, Learner, Types } from "@adewaskar/lms-common";

import { Fragment } from "react";
import LearnerTestResultStatus from "@Components/LearnerTestResultStatus";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { Link, useNavigate } from "@Router/index";

const { Title, Text } = Typography;

interface EnrolledTestItemPropsI {
  enrolledProduct: Types.EnrolledProductDetails;
}

export default function EnrolledTestItem(props: EnrolledTestItemPropsI) {
  const enrolledTest = props.enrolledProduct;
  const test = enrolledTest.product.data as Types.Test;
  const { data: category } = Learner.Queries.useGetProductCategoryDetails(
    test.category + ""
  );
  const navigate = useNavigate();
  const Ribbon = test?.live?.enabled ? Badge.Ribbon : Fragment;
  const { isMobile, isDesktop, isTablet } = useBreakpoint();
  const { mutate: retryTest, isLoading: retryingTest } =
    Learner.Queries.useRetryTest(test._id + "");
  return (
    <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
      <Card
        hoverable
        // onClick={() => window.open(`../../test/${test._id}`)}
        style={{
          width: "100%",
          borderRadius: 10,
        }}
        bodyStyle={{ padding: 10 }}
      >
        <Ribbon
          color="purple-inverse"
          placement="start"
          text={test.live.enabled ? "Live" : null}
        >
          <Row gutter={[10, 10]}>
            {/* <Col flex={isMobile ? 1 : "none"} xs={24}>
              <Image
                style={{ objectFit: "cover" }}
                height={isMobile ? 150 : 70}
                width={!isMobile ? 100 : "100%"}
                preview={false}
                src={test?.thumbnailImage}
              />
            </Col> */}
            <Col
              flex={1}
              xs={24}
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <Title
                style={{
                  marginTop: 0,
                  maxWidth: isMobile || isTablet ? 300 : "auto",
                }}
                level={5}
              >
                {test.title}
              </Title>
              {enrolledTest.metadata.test.endedAt ? (
                <Row gutter={[0, 10]}>
                  <Col>
                    <Tag>
                      Taken on{" "}
                      {dayjs(enrolledTest.metadata.test.startedAt).format("LL")}
                    </Tag>
                  </Col>
                  {enrolledTest.metadata.test.result.status ===
                  Enum.TestResultStatus.EVALUATED ? (
                    <Col>
                      <Tag color="volcano-inverse">
                        Scored:{" "}
                        {Math.ceil(
                          enrolledTest?.metadata?.test?.result?.data?.metrics
                            ?.learnerScore
                        )}
                        /
                        {
                          enrolledTest?.metadata?.test?.result?.data?.metrics
                            ?.totalTestScore
                        }
                      </Tag>
                    </Col>
                  ) : (
                    <Tag color="orange-inverse">Evaluation in progress</Tag>
                  )}
                </Row>
              ) : (
                <Row>
                  <Col>
                    {test.duration.enabled ? (
                      <Tag color="blue-inverse">{test.duration.value} mins</Tag>
                    ) : null}
                    {/* {test.pyq.enabled ? (
                      <Tag color="orange-inverse">
                        Previous Year Paper - {test.pyq.year}
                      </Tag>
                    ) : null} */}
                    {test.input.type === Enum.TestInputType.HANDWRITTEN ? (
                      <Tag color="orange-inverse">Handwritten</Tag>
                    ) : null}
                    {test.exam ? (
                      <Tag color="orange-inverse">
                        {/* ts-ignore */}
                        {
                          // ts-ignore
                          category.exams.find((e) => e._id === test.exam)?.title
                        }{" "}
                        {test.pyq.enabled ? (
                          <span> - {test.pyq.year}</span>
                        ) : null}
                      </Tag>
                    ) : null}
                    {test.live.scheduledAt &&
                    !enrolledTest.metadata.test.startedAt ? (
                      <Tag color="purple-inverse">
                        Scheduled On{" "}
                        {dayjs(test.live.scheduledAt).format("LLL")}
                      </Tag>
                    ) : null}
                  </Col>
                </Row>
              )}
              <Space />
            </Col>
            <Col
              // @ts-ignore
              xs={isMobile ? 24 : null}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: isMobile ? 0 : 10,
              }}
            >
              <Row
                gutter={[20, 20]}
                style={{ width: "100%", flex: 1 }}
                justify={"end"}
              >
                <Col xs={24} sm={12}>
                  <Button
                    // @ts-ignore
                    style={{
                      width: isMobile ? "100%" : 100,
                      marginRight: isMobile ? 0 : null,
                    }}
                    onClick={() => window.open(`/test/${test._id}`)}
                    // size='small'
                    block={!isDesktop}
                  >
                    View Details
                  </Button>
                </Col>
                {enrolledTest.metadata.test.endedAt ? (
                  <>
                    {/* {isDesktop?<LearnerTestResultStatus testId={test._id+''} />:null} */}
                    <Col xs={24} sm={12}>
                      <Link to={`/app/test/${test._id}/result`}>
                        <Dropdown.Button
                          loading={retryingTest}
                          menu={{
                            items: [
                              {
                                label: "Retry Test",
                                key: "retry",
                                onClick: () => {
                                  retryTest(undefined, {
                                    onSuccess: () => {
                                      message.open({
                                        type: "success",
                                        content: "Retrying Test",
                                      });
                                      navigate(`../../test/${test._id}/start`);
                                    },
                                  });
                                },
                              },
                            ],
                          }}
                          // icon={!isMobile ? <CheckCircleOutlined /> : null}
                          // onClick={() =>
                          //   navigate(`../../test/${test._id}/result`)
                          // }
                          block={!isDesktop}
                          // style={{ width: '100%' }}
                          // @ts-ignore
                          style={{ marginRight: isMobile ? 0 : null }}
                          type="primary"
                          // size='small'
                        >
                          Solutions
                        </Dropdown.Button>
                      </Link>
                    </Col>
                  </>
                ) : null}

                {!test?.live?.enabled ? (
                  !enrolledTest.metadata.test.startedAt ? (
                    <Col xs={24} sm={12}>
                      <Link to={`/app/test/${test._id}/start`}>
                        <Button
                          type="primary"
                          block={!isDesktop}
                          // onClick={() => navigate()}
                          // size='small'
                        >
                          Start Test
                        </Button>
                      </Link>
                    </Col>
                  ) : !enrolledTest.metadata.test.endedAt ? (
                    <Col xs={24} sm={12}>
                      <Link to={`/app/test/${test._id}/start`}>
                        <Button
                          block={!isDesktop}
                          danger
                          type="primary"
                          // onClick={() => navigate(`/app/test/${test._id}/start`)}
                          // size='small'
                        >
                          Continue Test
                        </Button>
                      </Link>
                    </Col>
                  ) : null
                ) : null}
              </Row>
            </Col>
          </Row>
        </Ribbon>
      </Card>
    </List.Item>
  );
}
