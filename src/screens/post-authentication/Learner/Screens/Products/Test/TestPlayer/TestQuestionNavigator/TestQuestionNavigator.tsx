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
} from "@Lib/index";
import { Enum, Learner, Store } from "@adewaskar/lms-common";
import { useNavigate, useParams } from "@Router/index";

import { NavLink } from "@Router/index";
import { TestNavigatorSkeleton } from "../../TestReview/TestItemSkeleton";
import TestTimer from "./TestTimer";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import TestScore from "@Components/TestScore";
import { useText } from "@Components/Editor/SunEditor/utils";

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
  const { data: { metadata: { test: { language } } } } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: props.testId + ''
  })
  const { isTablet, isDesktop, isMobile } = useBreakpoint();
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(
      props.testId + "",
      Enum.TestDetailMode.TEST
    );

  const { isLoading: loadingEnrolledTest } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: test._id,
    });

  const { token } = theme.useToken();
  const { questionId } = useParams();
  const isLoading = loadingTest || loadingEnrolledTest;
  let runningIndex = 0;
  const { FormatLangText, FormatNumber } = useText(language);
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
                {FormatLangText('ATTEMPTED')}
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button shape="circle" type="primary" danger />
                {FormatLangText('MARKED_FOR_REVIEW')}
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button shape="circle" />
                {FormatLangText('NOT_ANSWERED')}
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button
                  style={{ backgroundColor: token.colorPrimary }}
                  shape="circle"
                />{" "}
                {FormatLangText('CURRENT_QUESTION')}
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Title style={{ textAlign: "center" }} level={3}>
            {FormatLangText('QUESTION_PANEL')}
          </Title>
          {isLoading ? (
            <TestNavigatorSkeleton />
          ) : (
            sections.map((section) => {
              return (
                <Row>
                  <Col span={24}>
                    <Row justify={"space-between"} align={"middle"}>
                      {test.sections.length > 1 ? (
                        <Col>
                          <Title style={{ margin: "20px 0" }} level={4}>
                            {section.title}
                          </Title>
                        </Col>
                      ) : null}
                      <Col style={{ marginBottom: 20 }}>
                        <TestScore score={section.score} />
                      </Col>
                    </Row>
                    <Row gutter={[20, 20]}>
                      {section.items.map((item, itemIndex) => {
                        const totalIndex = runningIndex++;
                        return (
                          <Col span={3}>
                            <NavLink
                              title={item.title}
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
                                    {FormatNumber(totalIndex + 1)}
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
