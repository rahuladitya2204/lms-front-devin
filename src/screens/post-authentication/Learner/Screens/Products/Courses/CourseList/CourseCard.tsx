import { Card, Progress, Space, Tag } from "antd";
import { Learner, Types } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import styled from "@emotion/styled";

const { Text } = Typography;

interface CourseCardPropsI {
  courseId: string;
  enrolledProduct: Types.EnrolledProductDetails;
  progress: number;
  onClick: () => void;
}

const CardHolder = styled(Card)`
  cursor: pointer;

  .ant-card-cover {
    height: 200px !important;
  }
`;

const CourseCard: React.FC<CourseCardPropsI> = (props) => {
  const {
    data: { progress },
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: "course",
      id: props.courseId,
    },
    {
      enabled: !!props.courseId,
    }
  );
  const { enrolledProduct } = props;
  const { data: course } = Learner.Queries.useGetCourseDetails(props.courseId);
  return (
    <CardHolder
      hoverable
      onClick={props.onClick}
      bodyStyle={{ padding: 10 }}
      cover={
        <Image alt={course.title} height={180} src={course.thumbnailImage} />
      }
    >
      <Card.Meta
        // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={
          <Space direction="vertical">
            <Text style={{ fontSize: 13 }}>
              Started {dayjs(enrolledProduct.enrolledAt).format("MMMM D, YYYY")}
            </Text>
          </Space>
        }
        description={<Text strong>{course.title}</Text>}
      />
      <Progress percent={progress} />
      {enrolledProduct.plan.expiresAt ? (
        <Tag color="blue">
          Expires at{" "}
          {dayjs(enrolledProduct.plan.expiresAt).format("MMMM D, YYYY")}
        </Tag>
      ) : null}
    </CardHolder>
  );
};

export default CourseCard;
