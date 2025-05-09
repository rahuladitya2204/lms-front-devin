import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Learner, Types, Utils } from "@adewaskar/lms-common";
import { List, Skeleton } from "antd";

import { Typography } from "@Components/Typography";
import styled from "@emotion/styled";
import { useParams } from "@Router/index";

const { Text } = Typography;

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`;

const data = {
  // duration: {
  //   title: 'Duration',
  //   icon: <ClockCircleOutlined />,
  //   value: '43 Weeks'
  // },
  // lectures: {
  //   title: 'Lectures',
  //   icon: <ReadOutlined />,
  //   value: 1
  // },
  enrolled: {
    title: "Enrolled",
    icon: <CheckCircleOutlined />,
    value: "",
  },
  tests: {
    title: "Tests",
    icon: <EditOutlined />,
    value: "",
  },
  courses: {
    title: "Courses",
    icon: <VideoCameraOutlined />,
    value: "",
  },
  events: {
    title: "Events",
    icon: <CalendarOutlined />,
    value: "",
  },
  skillLevel: {
    title: "Skill Level",
    icon: <CheckCircleOutlined />,
    value: "",
  },
  certificate: {
    title: "Certificate",
    icon: <SafetyCertificateOutlined />,
    value: "",
  },
};

interface PackageMetadataPropsI {
  package: Types.Package;
}

function PackageMetadata(props: PackageMetadataPropsI) {
  const { id: packageId } = useParams();
  const { data: bundle, isFetching: loadingPackage } =
    Learner.Queries.useGetPackageDetails(packageId + "", {
      enabled: !!packageId,
    });
  if (bundle.products.test?.length) {
    data.tests.value = bundle.products.test?.length + "";
  }
  if (bundle.products.course?.length) {
    data.courses.value = bundle.products.course?.length + "";
  }
  if (bundle.products.event?.length) {
    data.events.value = bundle.products.event?.length + "";
  }
  if (bundle.analytics.enrolled.count) {
    // data.enrolled.value = bundle.analytics.enrolled.count + "";
    data.enrolled.value = `11.5K Students`;
  }
  const dataSource = Object.keys(data)
    // @ts-ignore
    .map((key) => data[key])
    .filter((i) => i.value);
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={(item) => (
        <ListItem actions={[<Text strong>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  );
}

export default PackageMetadata;

function formatTime(seconds: number) {
  if (seconds < 3600) {
    return "< 1hr";
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours}hr+`;
  }
}
