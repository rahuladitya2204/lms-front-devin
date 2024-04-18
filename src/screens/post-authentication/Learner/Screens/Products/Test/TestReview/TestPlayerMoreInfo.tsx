import { Enum, Learner, Types } from "@adewaskar/lms-common";

import { Card } from "@Lib/index";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import ProductDiscussion from "@Learner/Screens/ProductDiscussion";
import React from "react";
import Tabs from "@Components/Tabs";
import TestFeedback from "./TestFeedback";
import { Typography } from "@Components/Typography";
import { useReviewQuestion } from "./useReviewQuestion";

// import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'

const { Text } = Typography;
interface TestPlayerMoreInfoPropsI {
  test: Types.Test;
  itemId: string;
}

const TestPlayerMoreInfo: React.FC<TestPlayerMoreInfoPropsI> = (props) => {
  const {
    data: {
      metadata: {
        test: { language },
      },
    },
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: props.test._id + "",
  });
  // useWatchTime(props.course._id);
  const { currentQuestion } = useReviewQuestion();
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
      // {
      //   label: <Text strong>Announcements</Text>,
      //   key: '4',
      //   children: 'Tab 3'
      // },
      // {
      //   label: <Text strong>Reviews</Text>,
      //   key: '5',
      //   children: 'Tab 3'
      // },
      // {
      //   label: 'Learning Tools',
      //   key: '6',
      //   children: 'Tab 3'
      // }
    );
  }
  if (
    currentQuestion?.feedback?.met?.text ||
    currentQuestion?.feedback?.notMet?.text
  ) {
    TAB_ITEMS.unshift({
      label: `Feedback`,
      key: "feedback",
      children: (
        <TestFeedback
          testId={props.test._id + ""}
          itemId={props.itemId}
          currentQuestion={currentQuestion}
        />
      ),
    });
  }
  return TAB_ITEMS.length ? (
    <Card style={{ marginTop: 20 }}>
      <Tabs defaultActiveKey="1" items={TAB_ITEMS} />
    </Card>
  ) : null;
};

export default TestPlayerMoreInfo;
