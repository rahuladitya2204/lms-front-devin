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
import { Enum, Learner, Types, Utils } from "@adewaskar/lms-common";
import { htmlToText } from "html-to-text";
import slugify from "slugify";
import { TestNavigatorSkeleton } from "../TestReview/TestItemSkeleton";
import { Typography } from "@Components/Typography";
import { useQuestion } from "./PYQTestPlayerItem";
import { NavLink, useNavigate, useParams } from "@Router/index";
import TestScore from "@Components/TestScore";

import { useText } from "@Components/Editor/SunEditor/utils";
import { useOutletContext } from "react-router";

interface TestReviewQuestionNavigatorPropsI {
  testId: string;
  questionId: string;
  language: string;
  closeDrawer?: Function;
  isServer?: boolean;
}
const { confirm } = Modal;
const { Text, Title } = Typography;

export default function TestReviewQuestionNavigator(
  props: TestReviewQuestionNavigatorPropsI
) {
  const { isLoading: loadingResult, data: test } =
    Learner.Queries.useGetTestDetails(
      props.testId + "",
      Enum.TestDetailMode.RESULT
    );

  const { FormatLangText } = useText(props.language);
  const { currentQuestion, loading } = useQuestion();

  const { token } = theme.useToken();
  const { questionId: qID } = useParams();
  const questionId = getIdFromSlug(qID);
  const isLoading = loadingResult;
  // const Utils.getQuestionSlugFromID = (item: Types.TestQuestion) => {
  //   return `${`${htmlToText(item.title.text["eng"]).slice(0, 15)}----${
  //     item._id
  //   }`}`;
  // };
  let runningIndex = 0;
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
          <Title style={{ textAlign: "center" }} level={3}>
            {FormatLangText('QUESTION_PANEL')}
          </Title>
          {test.sections.map((section: any) => {
            return (
              <Row>
                <Col span={24}>
                  <Row justify={"space-between"} align={"middle"}>
                    <Col>
                      <Title style={{ margin: "20px 0" }} level={4}>
                        {section.title}
                      </Title>
                    </Col>
                    <Col>
                      <TestScore score={section.score} />
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
                            to={
                              props.isServer
                                ? `/test/${test.slug || test._id
                                }/previous-year-questions/${Utils.getQuestionSlugFromID(
                                  item
                                )}`
                                : `/app/test/${test.slug || test._id
                                }/previous-year-questions/${Utils.getQuestionSlugFromID(
                                  item
                                )}`
                            }
                            children={() => {
                              const isActive = questionId === item._id;
                              return (
                                // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                                // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                                <Button
                                  // loading={loading && isCurrent}
                                  // onClick={() =>
                                  //   navigate(
                                  //     props.isServer
                                  //       ? `/test/${test.slug || test._id}/previous-year-questions/${
                                  //           item._id
                                  //         }`
                                  //       : `/app/test/${
                                  //           test.slug || test._id
                                  //         }/previous-year-questions/${item._id}`
                                  //   )
                                  // }
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
          })}
        </Col>
      </Row>
    </Card>
  );
}

export const getIdFromSlug = (slug: string) => {
  return slug?.split(`-`)?.pop();
};
