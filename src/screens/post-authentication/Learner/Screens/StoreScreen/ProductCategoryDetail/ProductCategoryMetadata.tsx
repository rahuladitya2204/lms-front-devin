import { Button, List, Tag } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloudDownloadOutlined,
  DownloadOutlined,
  EditOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  LinkOutlined,
  MoneyCollectOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Learner, Types, Utils } from "@adewaskar/lms-common";

import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import { LogEvent } from "@ServerHooks/useDehydration";
import { getIsServer } from "@ServerUtils/index";

const { Text } = Typography;

const CustomList = styled(List)`
  .ant-list-item-action {
    margin-left: 30px !important;
  }
`;

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`;

const data = {
  registrationDate: {
    title: "Registration Date",
    icon: <CalendarOutlined />,
    value: "12",
  },
  salary: {
    title: "Salary",
    icon: <MoneyCollectOutlined />,
    value: "43 Weeks",
  },
  vacancies: {
    title: "Vacancies",
    icon: <EditOutlined />,
    value: "null",
  },
  eligibility: {
    title: "Eligibility",
    icon: <FileTextOutlined />,
    value: "null",
  },
  examDate: {
    title: "Exam Date",
    icon: <FileTextOutlined />,
    value: "null",
  },
  officialNotification: {
    title: "Official Notification",
    icon: <CloudDownloadOutlined />,
    value: "1",
  },
  registrationLink: {
    title: "Registration Link",
    icon: <LinkOutlined />,
    value: "1",
  },
  calendarLink: {
    title: "Calendar Link",
    icon: <LinkOutlined />,
    value: "1",
  },
};

interface ProductCategoryMetadataPropsI {
  productCategory: Types.ProductCategory;
}

function ProductCategoryMetadata(props: ProductCategoryMetadataPropsI) {
  const { data: categoryDetails, isLoading: loadingEnrolledProductCategory } =
    Learner.Queries.useGetProductCategoryDetails(props.productCategory.slug, 'basic');

  // @ts-ignore
  data.registrationDate.value = // @ts-ignore
    <Tag color="blue-inverse">{categoryDetails.info.registration.date}</Tag>;

  // @ts-ignore
  data.salary.value = categoryDetails.info.salaryRange ? ( // @ts-ignore
    <Tag color="orange-inverse">{categoryDetails.info.salaryRange}</Tag>
  ) : null;

  // @ts-ignore
  data.vacancies.value = categoryDetails.info.vacancies ? ( // @ts-ignore
    <Tag color="purple-inverse">{categoryDetails.info.vacancies}</Tag>
  ) : null;

  // @ts-ignore
  data.eligibility.value = categoryDetails.info.eligibility ? ( // @ts-ignore
    <Tag color="cyan-inverse">{categoryDetails.info.eligibility}</Tag>
  ) : null;

  // @ts-ignore
  data.examDate.value = categoryDetails.info.examDate ? ( // @ts-ignore
    <Tag color="red-inverse">
      {getIsServer() ? 'Loading...' : categoryDetails.info.examDate}
    </Tag>
  ) : null;

  // @ts-ignore
  data.officialNotification.value = categoryDetails.info.officialNotification
    .link ? (
    <Button
      icon={<DownloadOutlined />}
      onClick={() => {
        LogEvent(
          "Category",
          "Official Notification Link::Clicked",
          categoryDetails.title,
          {
            clickedFrom: "Product Category Detail Page",
            categoryId: categoryDetails._id,
          }
        );
        window.open(categoryDetails.info.officialNotification.link);
      }}
      type="primary"
      size="small"
    >
      Download PDF
    </Button>
  ) : null; // @ts-ignore

  // @ts-ignore
  data.registrationLink.value = (
    <Button
      icon={<LinkOutlined />}
      onClick={() => {
        LogEvent(
          "Category",
          "Registration Link::Clicked",
          categoryDetails.title,
          {
            categoryId: categoryDetails._id,
            clickedFrom: "Product Category Detail Page",
          }
        );
        window.open(categoryDetails.info.registration.link);
      }}
      type="primary"
      size="small"
    >
      Open Link
    </Button>
  ); // @ts-ignore

  // @ts-ignore
  data.calendarLink.value = (
    <Button
      icon={<LinkOutlined />}
      onClick={() => window.open(categoryDetails.info.calendar.link)}
      type="primary"
      size="small"
    >
      Open Link
    </Button>
  ); // @ts-ignore

  data.calendarLink.value = (
    <Button
      icon={<LinkOutlined />}
      onClick={() => window.open(categoryDetails.info.calendar.link)}
      type="primary"
      size="small"
    >
      Open Link
    </Button>
  ); // @ts-ignore

  // data.certificate.value = props.productCategory.certificate ? 'Yes' : ''
  // data.questions.value = useMemo(
  //   () => props.productCategory.sections.map(i => i.items).flat().length.toString(),
  //   [props.productCategory]
  // )
  // @ts-ignore
  const dataSource = Object.keys(data).map((key) => data[key]);
  return (
    <CustomList
      grid={{ lg: 3, xxl: 4, md: 3, xl: 3, sm: 2, xs: 1 }}
      style={{ marginLeft: 30 }}
      itemLayout="horizontal"
      dataSource={dataSource.filter((i) => i.value)}
      renderItem={(item) => (
        // @ts-ignore
        <ListItem actions={[<Text>{item.value}</Text>]}>
          <List.Item.Meta
            // @ts-ignore
            avatar={item.icon}
            // @ts-ignore
            title={<Text>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  );
}

export default ProductCategoryMetadata;
