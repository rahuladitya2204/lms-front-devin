import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  HighlightTwoTone,
  InfoCircleOutlined,
  WarningOutlined,
  WarningTwoTone,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Skeleton,
  Space,
  Spin,
  theme,
} from "antd";
import { Enum, Learner, Store } from "@adewaskar/lms-common";
import { useNavigate, useParams } from "@Router/index";

import { NavLink } from "@Router/index";
import { TestNavigatorSkeleton } from "../../TestReview/TestItemSkeleton";
import TestTimer from "./TestTimer";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";

interface TestQuestionNavigatorPropsI {
  testId: string;
  questionId: string;
  closeDrawer?: Function;
}
const { Title } = Typography;

export default function TestQuestionNavigator(
  props: TestQuestionNavigatorPropsI
) {
  const navigate = useNavigate();
  const {
    data: {
      status: { sections, hasStarted, hasEnded },
    },
  } = Learner.Queries.useGetTestStatus(props.testId + "");

  const { isLoading: loadingEnrolledTest } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: "test",
      id: props.testId,
    });
  const { isTablet, isDesktop, isMobile } = useBreakpoint();
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(
      props.testId + "",
      Enum.TestDetailMode.TEST
    );
  const { token } = theme.useToken();
  const { questionId } = useParams();
  const isLoading = loadingTest || loadingEnrolledTest;
  let runningIndex = 0;
  return (
    <Card
      // style={{ height: '80vh' }}
      bodyStyle={{
        // overflow: 'scroll', height: '100%',
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Row>
        {isDesktop ? (
          <>
            {test.duration.enabled ? (
              <Col span={24}>
                {/* <Button type='primary' style={{marginBottom:30}} danger block size='large'> Submit Test</Button> */}
                <Row justify={"center"} align={"middle"}>
                  <Col>
                    <TestTimer testId={props.testId} />
                  </Col>
                </Row>
                <Divider style={{ margin: 0, marginTop: 10 }} />
              </Col>
            ) : null}
          </>
        ) : null}
        <Col span={24} style={{ marginTop: 25 }}>
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Space>
                <Button
                  shape="circle"
                  style={{ backgroundColor: token.colorSuccessActive }}
                  type="primary"
                />{" "}
                Attempted
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button shape="circle" type="primary" danger /> Marked for
                Review
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button shape="circle" /> Not Attempted
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button
                  style={{ backgroundColor: token.colorPrimary }}
                  shape="circle"
                />{" "}
                Current Question
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Title style={{ textAlign: "center" }} level={3}>
            Question Panel
          </Title>
          {isLoading ? (
            <TestNavigatorSkeleton />
          ) : (
            sections.map((section) => {
              return (
                <Row>
                  <Col span={24}>
                    <Title level={4}>{section.title}</Title>
                    <Row gutter={[20, 20]}>
                      {section.items.map((item, itemIndex) => {
                        const totalIndex = runningIndex++;
                        return (
                          <Col span={3}>
                            <NavLink
                              style={{ width: "100%" }}
                              key={item._id}
                              to={`/app/test/${test._id}/player/${item._id}`}
                              children={() => {
                                const isActive = questionId === item._id;
                                return (
                                  // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                                  // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                                  <Button
                                    // loading={loading && isCurrent}
                                    onClick={() => {
                                      navigate(
                                        `/app/test/${test._id}/player/${item._id}`
                                      );
                                      props.closeDrawer && props.closeDrawer();
                                    }}
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
                                    }}
                                    shape="circle"
                                  >
                                    {totalIndex + 1}
                                  </Button>
                                  //  </Badge>
                                );
                              }}
                            />
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              );
            })
          )}
        </Col>
      </Row>
    </Card>
  );
}
