import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Learner, Types, Utils } from "@adewaskar/lms-common";
import { List, Tag, Tooltip } from "antd";

import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import styled from "@emotion/styled";

const { Text } = Typography;

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`;

const data = {
  scheduledFor: {
    title: "Date",
    icon: <CalendarOutlined />,
    value: "",
  },
  duration: {
    title: "Duration",
    icon: <ClockCircleOutlined />,
    value: "43 Weeks",
  },
  mode: {
    title: "Test Mode",
    icon: <EditOutlined />,
    value: null,
  },
  language: {
    title: "Language",
    icon: <FileTextOutlined />,
    value: null,
  },
  enrolled: {
    title: "Enrolled",
    icon: <SafetyCertificateOutlined />,
    value: "10k+ Students",
  },
  expiresAt: {
    title: "You can access till",
    icon: <ScheduleOutlined />,
    value: "",
  },
  // questions: {
  //   title: 'Questions',
  //   icon: <EditOutlined />,
  //   value: '-'
  // },
  // language: {
  //   title: 'Language',
  //   icon: <CheckCircleOutlined />,
  //   value: 'English'
  // },
  // skillLevel: {
  //   title: 'Skill Level',
  //   icon: <CheckCircleOutlined />,
  //   value: 'Beginner'
  // },
  // certificate: {
  //   title: 'Certificate',
  //   icon: <SafetyCertificateOutlined />,
  //   value: 'Yes'
  // }
};

interface TestMetadataPropsI {
  test: Types.Test;
}

function TestMetadata(props: TestMetadataPropsI) {
  const { data: enrolledDetails, isLoading: loadingEnrolledTest } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: props.test._id + "",
    });
  // const { data: { wallet } } = Learner.Queries.useGetLearnerDetails();
  data.scheduledFor.value = props.test.live.enabled
    ? dayjs(props.test.live.scheduledAt).format("LLL")
    : "Can be taken anytime";
  // @ts-ignore
  data.duration.value = props.test.duration.enabled
    ? formatTime(props.test.duration.value)
    : null;
  // commenting out for now
  // if (props.test.analytics.enrolled.count) {
  //   data.enrolled.value = `${props.test.analytics.enrolled.count} students`;
  // }
  if (props.test.input.type === Enum.TestInputType.HANDWRITTEN) {
    // @ts-ignore
    data.mode.value = (
      <Tooltip title="Answer images will be evaluated by our AI">
        <Tag
          style={{ marginRight: 0 }}
          color="volcano-inverse"
          icon={<InfoCircleOutlined />}
        >
          Handwritten
        </Tag>
      </Tooltip>
    );
  }
  if (enrolledDetails.plan.expiresAt) {
    data.expiresAt.value = dayjs(enrolledDetails.plan.expiresAt).format("LL");
  }
  if (props.test.languages.length) {
    // @ts-ignore
    data.language.value = Constants.LANGUAGES.filter((l) =>
      props.test.languages.includes(l.value)
    ).map((l) => (
      <Tag style={{ marginLeft: 10, marginRight: 0 }} color="purple">
        {l.label}
      </Tag>
    ));
    // .join(", ");
    if (props.test.languages.length > 1) {
      data.language.title = "Languages";
    }
  }
  // data.certificate.value = props.test.certificate ? 'Yes' : ''
  // data.questions.value = useMemo(
  //   () => props.test.sections.map(i => i.items).flat().length.toString(),
  //   [props.test]
  // )
  // @ts-ignore
  const dataSource = Object.keys(data).map((key) => data[key]);
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource.filter((i) => i.value)}
      renderItem={(item) => (
        <ListItem actions={[<Text>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  );
}

export default TestMetadata;

function formatTime(minute: number) {
  const seconds = minute * 60;
  if (minute < 60) {
    return `${minute} mins`;
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hr`;
  }
}
