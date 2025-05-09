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
import { Enum, Learner } from "@adewaskar/lms-common";
import { useNavigate, useParams } from "@Router/index";

import { NavLink } from "@Router/index";
import { TestNavigatorSkeleton } from "./TestItemSkeleton";
import { Typography } from "@Components/Typography";
import { useReviewQuestion } from "./useReviewQuestion";
import TestScore from "@Components/TestScore";
import { useText } from "@Components/Editor/SunEditor/utils";

interface TestReviewQuestionNavigatorPropsI {
  testId: string;
  questionId: string;
  closeDrawer?: Function;
}
const { confirm } = Modal;
const { Text, Title } = Typography;

export default function TestReviewQuestionNavigator(
  props: TestReviewQuestionNavigatorPropsI
) {
  const navigate = useNavigate();
  const {
    isLoading: loadingResult,
    data: {
      test: { sections },
    },
  } = Learner.Queries.useGetTestResult(props.testId + "");
  const { currentQuestion, loading } = useReviewQuestion();
  // const { isTablet, isDesktop, isMobile } = useBreakpoint()
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(
      props.testId + "",
      Enum.TestDetailMode.RESULT
    );
  const { data: { metadata: { test: { language } } } } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: test._id + "",
  });
  const { token } = theme.useToken();
  const { questionId } = useParams();
  const isLoading = loadingResult || loadingTest;
  let runningIndex = 0;
  const { FormatLangText } = useText(language);
  return (
    <Card
      // style={{ height: '80vh' }}
      bodyStyle={{
        // overflow: 'scroll',
        // height: '100%',
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Row>
        <Col span={24}>
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Space>
                <Button
                  shape="circle"
                  style={{ backgroundColor: token.colorSuccessActive }}
                  type="primary"
                />{" "}
                {FormatLangText('CURRENT_QUESTION')}
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button shape="circle" type="primary" danger /> {FormatLangText('INCORRECT_ANSWER')}
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <Button shape="circle" /> {FormatLangText('NOT_ATTEMPTED')}
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
            sections.map((section: any) => {
              return (
                <Row>
                  <Col span={24}>
                    <Row align={"middle"} justify={"space-between"}>
                      {test.sections.length > 1 ? (
                        <Col>
                          <Title style={{ margin: "20px 0" }} level={4}>
                            {section.title}
                          </Title>
                        </Col>
                      ) : null}
                      <Col style={{ marginBottom: 20 }}>
                        <TestScore language={language} score={section.score} />
                      </Col>
                    </Row>
                    <Row gutter={[20, 20]}>
                      {section.items.map((item: any, itemIndex: number) => {
                        const totalIndex = runningIndex++;
                        return (
                          <Col span={3}>
                            <NavLink
                              title={item.title}
                              onClick={() => {
                                props.closeDrawer && props.closeDrawer();
                              }}
                              style={{ width: "100%" }}
                              key={item._id}
                              to={`/app/test/${test._id}/review/${item._id}`}
                              children={() => {
                                const isActive = questionId === item._id;
                                return (
                                  // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                                  // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                                  <Button
                                    // loading={loading && isCurrent}
                                    onClick={() =>
                                      navigate(
                                        `/app/test/${test._id}/review/${item._id}`
                                      )
                                    }
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
