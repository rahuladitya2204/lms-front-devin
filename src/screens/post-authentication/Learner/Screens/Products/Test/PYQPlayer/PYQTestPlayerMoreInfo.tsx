import { Enum, Learner, Types, Utils } from "@adewaskar/lms-common";

import { Button, Card, Col, Row, Skeleton } from "@Lib/index";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import ProductDiscussion from "@Learner/Screens/ProductDiscussion";
import React from "react";
import Tabs from "@Components/Tabs";
import { Typography } from "@Components/Typography";
import { useQuestion } from "./PYQTestPlayerItem";
import { DownloadOutlined, WhatsAppOutlined } from "@ant-design/icons";
import ShowMore from "@Components/ShowMore/ShowMore";
import { htmlToText } from "html-to-text";
import useBreakpoint from "@Hooks/useBreakpoint";
import AuthProtectedCTA from "@Components/AuthProtectedCTA";
import { downloadFileFromUrl } from "@Components/Editor/SunEditor/utils";
import PromotedProducts from "../../../StoreScreen/ProductCategoryDetail/PromotedProducts";
import LearnerProductCard from "@Components/LearnerProductCard";

// import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'

const { Text } = Typography;
interface TestPlayerMoreInfoPropsI {
  test: Types.Test;
  itemId: string;
  language: string;
}

const TestPlayerMoreInfo: React.FC<TestPlayerMoreInfoPropsI> = (props) => {
  const { test } = props;
  const testId = test.slug || test._id;
  // useWatchTime(props.course._id);
  const language = props.language;
  const {
    currentQuestion,
    currentQuestionIndex,
    loading: loadingQuestion,
  } = useQuestion();
  const TAB_ITEMS = [];
  if (currentQuestion.solution?.html[language]) {
    TAB_ITEMS.push(
      {
        label: `Solution`,
        key: "notes",
        children: (
          <HtmlViewer content={currentQuestion.solution?.html[language] + ""} />
        ),
      },
      {
        label: `Discussion`,
        key: "discussion",
        children: (
          <ProductDiscussion
            itemId={props.itemId}
            product={{ type: "test", id: test._id + "" }}
          />
        ),
      }
    );
  }
  const {
    mutate: printTestQuestionSolution,
    isLoading: printingQuestionSolution,
  } = Learner.Queries.usePrintTestQuestionSolution(test._id + "");
  const printTestSolution = () => {
    printTestQuestionSolution(
      {
        questionId: currentQuestion._id,
      },
      {
        onSuccess: (d) => {
          downloadFileFromUrl(
            d,
            `${test.title} - Question-${currentQuestionIndex + 1}`
          );
        },
      }
    );
  };
  // const { isMobile } = useBreakpoint();
  const { data: category } = Learner.Queries.useGetProductCategoryDetails(
    test.category + ""
  );

  const { data: tests } = Learner.Queries.useGetPromotedProducts(
    Enum.ProductType.TEST,
    {
      category: test.category,
      limit: 4,
      mode: "free",
    }
  );
  // console.log(tests, packages, "12121");
  return (
    <Row gutter={[20, 20]}>
      {loadingQuestion ? (
        <Skeleton.Button
          active
          block
          style={{ height: 400, margin: "20px 10px 0" }}
        />
      ) : (
        <>
          {tests.length ? (
            <Col span={24}>
              <Card
                style={{ marginTop: 15 }}
                title={`Try our latest ${category.title} Test Series`}
              >
                <ShowMore minHeight={200}>
                  <Row gutter={[20, 20]}>
                    {tests.map((product) => {
                      return (
                        <Col
                          sm={12}
                          key={product?._id + ""}
                          md={12}
                          xs={24}
                          lg={12}
                          xl={12}
                          xxl={8}
                        >
                          <LearnerProductCard isServer mini product={product} />
                        </Col>
                      );
                    })}
                  </Row>
                </ShowMore>
              </Card>
              {currentQuestion.solution?.html[language] ? (
                <Card title="Detailed Solution" style={{ marginTop: 20 }}>
                  <ShowMore minHeight={200}>
                    <HtmlViewer
                      content={currentQuestion.solution?.html[language] + ""}
                    />
                  </ShowMore>
                </Card>
              ) : null}
            </Col>
          ) : null}
          <Col span={24}>
            <Row
              gutter={[30, 30]}
              justify={"center"}
              align={"middle"}
              style={{ marginTop: 20 }}
            >
              <Col flex={1}>
                <AuthProtectedCTA onClick={() => printTestSolution()}>
                  <Button
                    loading={printingQuestionSolution}
                    icon={<DownloadOutlined />}
                    block
                    danger
                  >
                    Download Solution PDF
                  </Button>
                </AuthProtectedCTA>
              </Col>
              <Col flex={1}>
                <Button
                  onClick={() => {
                    window.open(
                      `https://api.whatsapp.com/send?text=[SOLVED]${htmlToText(
                        currentQuestion.title
                      ).slice(
                        0,
                        50
                      )}. Check Now: https://www.testmint.ai/test/${testId}/previous-year-questions/${Utils.getQuestionSlugFromID(
                        currentQuestion
                      )}`
                    );
                  }}
                  icon={<WhatsAppOutlined />}
                  block
                  type="primary"
                >
                  Share on Whatsapp
                </Button>
              </Col>
            </Row>
          </Col>
        </>
      )}
    </Row>
  );
};

export default TestPlayerMoreInfo;
