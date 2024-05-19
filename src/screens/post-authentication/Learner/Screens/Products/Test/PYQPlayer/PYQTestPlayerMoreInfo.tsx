import { Enum, Learner, Types, Utils } from "@adewaskar/lms-common";

import { Button, Card, Col, Row } from "@Lib/index";
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

// import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'

const { Text } = Typography;
interface TestPlayerMoreInfoPropsI {
  test: Types.Test;
  itemId: string;
  language: string;
}

const TestPlayerMoreInfo: React.FC<TestPlayerMoreInfoPropsI> = (props) => {
  const testId = props.test.slug || props.test._id;
  // useWatchTime(props.course._id);
  const language = props.language;
  const { currentQuestion, currentQuestionIndex } = useQuestion();
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
            product={{ type: "test", id: props.test._id + "" }}
          />
        ),
      }
    );
  }
  const {
    mutate: printTestQuestionSolution,
    isLoading: printingQuestionSolution,
  } = Learner.Queries.usePrintTestQuestionSolution(props.test._id + "");
  const printTestSolution = () => {
    printTestQuestionSolution(
      {
        questionId: currentQuestion._id,
      },
      {
        onSuccess: (d) => {
          downloadFileFromUrl(
            d,
            `${props.test.title} - Question-${currentQuestionIndex + 1}`
          );
        },
      }
    );
  };

  // return TAB_ITEMS.length ? (
  //   <Card style={{ marginTop: 20 }}>
  //     <Tabs defaultActiveKey="1" items={TAB_ITEMS} />
  //   </Card>
  // ) : null;
  const { isMobile } = useBreakpoint();
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Card
          title="Detailed Solution"
          style={{ marginTop: 20 }}
          // extra={[
          //   <Button
          //     danger
          //     size="small"
          //     loading={printingQuestionSolution}
          //     type="primary"
          //     icon={<DownloadOutlined />}
          //     onClick={() => printTestSolution()}
          //   >
          //     {isMobile ? "Solution" : "Download Solution PDF"}
          //   </Button>,
          // ]}
        >
          <ShowMore minHeight={200}>
            <HtmlViewer
              content={currentQuestion.solution?.html[language] + ""}
            />
          </ShowMore>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[30, 30]} justify={"center"} align={"middle"}>
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
    </Row>
  );
};

export default TestPlayerMoreInfo;
