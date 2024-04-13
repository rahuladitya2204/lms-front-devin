import { Enum, Learner, Types } from "@adewaskar/lms-common";

import { Card } from "@Lib/index";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import ProductDiscussion from "@Learner/Screens/ProductDiscussion";
import React from "react";
import Tabs from "@Components/Tabs";
import { Typography } from "@Components/Typography";
import { useQuestion } from "./PYQTestPlayerItem";

// import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'

const { Text } = Typography;
interface TestPlayerMoreInfoPropsI {
  test: Types.Test;
  itemId: string;
  language: string;
}

const TestPlayerMoreInfo: React.FC<TestPlayerMoreInfoPropsI> = (props) => {
  // useWatchTime(props.course._id);
  const language = props.language;
  const { currentQuestion } = useQuestion();
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

  // return TAB_ITEMS.length ? (
  //   <Card style={{ marginTop: 20 }}>
  //     <Tabs defaultActiveKey="1" items={TAB_ITEMS} />
  //   </Card>
  // ) : null;

  return (
    <Card title="Detailed Solution" style={{ marginTop: 20 }}>
      <HtmlViewer content={currentQuestion.solution?.html[language] + ""} />
    </Card>
  );
};

export default TestPlayerMoreInfo;
