import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Enum, Learner, Types, Utils } from "@adewaskar/lms-common";
import { List, Tag } from "antd";

import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import styled from "@emotion/styled";

const { Text } = Typography;

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`;

const data = {
  takenOn: {
    title: "Taken On",
    icon: <CalendarOutlined />,
    value: "",
  },
  timeTaken: {
    title: "Time Taken",
    icon: <ClockCircleOutlined />,
    value: "43 Weeks",
  },
  //   score: {
  //     title: 'Score',
  //     icon: <CheckCircleOutlined />,
  //     value: '1'
  //   },
  language: {
    title: "Language",
    icon: <CheckCircleOutlined />,
    value: "English",
  },
  //   result: {
  //     title: 'Result',
  //     icon: <SafetyCertificateOutlined />,
  //     value: <span />
  //   }
};

interface CompletedLiveTestCardPropsI {
  test: Types.Test;
}

function CompletedLiveTestCard(props: CompletedLiveTestCardPropsI) {
  const test = props.test;
  const testId = props.test._id;
  const { data: enrolledDetails } =
    Learner.Queries.useGetEnrolledProductDetails(
      {
        type: Enum.ProductType.TEST,
        id: test._id + "",
      },
      {
        enabled: !!testId,
      }
    );
  const testStartDate =
    enrolledDetails.metadata.test.startedAt || test.live.startedAt;

  const testEndDate =
    enrolledDetails.metadata.test.endedAt || test.live.endedAt;

  data.takenOn.value = props.test.live.enabled
    ? dayjs(props.test.live.scheduledAt).format("LLL")
    : "Can be taken anytime";
  data.timeTaken.value = formatTime(
    dayjs(testEndDate).toDate().getTime() -
      dayjs(testEndDate).toDate().getTime()
  );

  const {
    data: { test: testResult },
    isFetching: loadingResult,
  } = Learner.Queries.useGetTestResult(testId + "");
  // @ts-ignore
  // data.score.value = `${testResult.learnerScore}/${testResult.passingScore}`

  // @ts-ignore
  const dataSource = Object.keys(data).map((key) => data[key]);
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={(item) => (
        <ListItem actions={[<Text strong>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text strong>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  );
}

export default CompletedLiveTestCard;

function formatTime(minute: number) {
  const seconds = minute * 60;
  if (minute < 60) {
    return `${minute} mins`;
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hr`;
  }
}
