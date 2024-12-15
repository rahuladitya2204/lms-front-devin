import { Badge, Card, Col, Divider, Rate, Row, Space, Tag } from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Learner, Types } from "@adewaskar/lms-common";
import Image from "next/image";
import PriceCardContent from "./PriceCardContent";
import { Typography } from "@Components/Typography";
import { Utils } from "@adewaskar/lms-common";
import { capitalize } from "lodash";
import styled from "@emotion/styled";
import { useNavigate } from "@Router/index";
import MiniCard from "./MiniCard";
import { Title } from "@Components/Typography/Typography";

const { Text } = Typography;

const { UnitTypeToStr } = Utils;

interface TestCardPropsI {
  test: Types.Test;
  isServer?: boolean;
  hideCoverImg?: boolean;
  children?: React.ReactNode;
  noClick?: boolean;
  hideMeta?: boolean;
  mini?: boolean;
}

const CustomCard = styled(Card)`
  cursor: pointer;
  /* margin-left: 30px;
margin-bottom: 20px; */
`;

function TestCard(props: TestCardPropsI) {
  const { test } = props;
  const navigate = useNavigate();
  const { data: category } = Learner.Queries.useGetProductCategoryDetails(
    test.category + ""
  );
  const plan =
    (test.plan as unknown as Types.Plan) ||
    Constants.INITIAL_COURSE_PLAN_DETAILS;
  // const user = test.user as unknown as Types.User;
  const formattedDuration = test.duration.enabled
    ? Utils.formatTime(test.duration.value * 60)
    : null;
  const TAGS = (
    <>
      {test.duration.enabled ? (
        <Tag style={{ fontSize: 12 }} color="blue-inverse">
          {test.duration.value} mins
        </Tag>
      ) : null}
      {test?.stats?.score?.total ? (
        <Tag style={{ fontSize: 12 }} color="orange-inverse">
          {test.stats.score.total} marks
        </Tag>
      ) : null}

      {test?.stats?.question?.count ? (
        <Tag style={{ fontSize: 12 }} color="red-inverse">
          {test.stats.question.count} Questions
        </Tag>
      ) : null}
    </>
  );
  if (props.mini) {
    return (
      <MiniCard
        title={test.title}
        subtitle={test.subtitle}
        accessoryLeft={
          <Image
            alt={test.title}
            src={category.thumbnailImage}
            width={80}
            height={80}
          />
        }
      >
        <Title style={{ fontSize: 13 }}>{test.title}</Title>
        {TAGS}
      </MiniCard>
    );
  }

  return (
    // <Badge.Ribbon text="Best Seller" color="orange">
    <CustomCard
      hoverable
      onClick={(e) => {
        if (!props.noClick) {
          navigate(
            props.isServer ? `/test/${test._id}` : `/app/test/${test._id}`
          );
        }
      }}
      bodyStyle={{ padding: 15 }}
    // cover={
    //   test.thumbnailImage ? (
    //     !props.hideCoverImg ? (
    //       <Image
    //         alt="example"
    //         style={{ height: 140 }}
    //         src={test.thumbnailImage}
    //       />
    //     ) : null
    //   ) : null
    // }
    >
      <Card.Meta
        title={
          <Space size="small" direction="vertical">
            <Text
              ellipsis
              style={{
                fontSize: 16,
                whiteSpace: "normal", // Ensures text wraps
                overflowWrap: "break-word", // Breaks words to prevent overflow
              }}
            >
              {test.title}
            </Text>
          </Space>
        }
      />
      {!props.hideMeta ? (
        <Row justify={"space-between"} style={{ marginTop: 10 }}>
          <Col>
            {formattedDuration ? (
              <Tag
                icon={<ClockCircleOutlined />}
                color="blue-inverse"
                style={{ fontSize: 13 }}
              >
                {formattedDuration}
              </Tag>
            ) : null}
            {test.input.type === Enum.TestInputType.HANDWRITTEN ? (
              <Tag
                icon={<EditOutlined />}
                color="volcano-inverse"
                style={{ fontSize: 13 }}
              >
                Handwritten
              </Tag>
            ) : null}
          </Col>
        </Row>
      ) : null}

      <Row justify={"space-between"} style={{ marginTop: 15 }}>
        <Col span={24}>
          {props.children ? (
            props.children
          ) : (
            <>
              <Divider style={{ marginTop: 10, marginBottom: 10 }} />
              <PriceCardContent plan={plan} />
            </>
          )}
        </Col>
      </Row>
    </CustomCard>
  );
}

export default TestCard;
