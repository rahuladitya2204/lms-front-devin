import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Skeleton,
  Spin,
  Tag,
  Tooltip,
} from "@Lib/index";
import { Constants, Enum, Learner, Types, User } from "@adewaskar/lms-common";
import AppImage from "@Components/Image";
import { Text, Title } from "./Typography/Typography";
import MiniCard from "@Screens/post-authentication/Learner/Screens/StoreScreen/Cards/MiniCard";
import styled from "@emotion/styled";
import {
  BookOutlined,
  BookTwoTone,
  FileTextTwoTone,
  InfoCircleOutlined,
  InfoCircleTwoTone,
} from "@ant-design/icons";

const CustomTag = styled(Text)`
  margin-top: 3px;
`;

interface LearnerProductCardPropsI {
  product: Types.Product;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
  onClick?: Function;
  mini?: boolean;
}

const LearnerProductCard = (props: LearnerProductCardPropsI) => {
  const {
    product: { data: product },
  } = props;
  const Component = props.mini ? (
    <MiniCard
      accessoryLeft={
        product.thumbnailImage ? (
          <AppImage src={product.thumbnailImage} width={80} height={80} />
        ) : null
      }
      footer={
        <>
          {product?.languages?.length ? (
            <Col>
              <Button style={{ padding: 0, fontSize: 13 }} type="link">
                <BookTwoTone /> Syllabus
              </Button>
              <Divider type="vertical" />
              <Button
                style={{ padding: 0, fontSize: 13 }}
                type="link"
                // title={``}
              >
                <FileTextTwoTone />
                {product?.languages
                  .map(
                    (i) => Constants.LANGUAGES.find((l) => l.value === i)?.label
                  )
                  .join(", ")}
              </Button>
            </Col>
          ) : null}
        </>
      }
    >
      <Title style={{ fontSize: 13 }}>
        <Row justify={"space-between"}>
          <Col> {product.title}</Col>
          {/* {product?.languages?.length ? (
            <Col>
              <Tooltip
                title={`Language: ${product?.languages
                  .map(
                    (i) => Constants.LANGUAGES.find((l) => l.value === i)?.label
                  )
                  .join(", ")}`}
              >
                <InfoCircleTwoTone />
              </Tooltip>
            </Col>
          ) : null} */}
        </Row>
      </Title>
      {props.children}
      {product.duration ||
      product?.stats?.score?.total ||
      product?.languages?.length ||
      product?.products?.test ||
      product?.question?.count ? (
        <Divider style={{ margin: "10px 0" }} />
      ) : null}

      {product?.duration?.enabled ? (
        <CustomTag color="blue">
          {product.duration.value} mins
          <Divider type="vertical" />
        </CustomTag>
      ) : null}
      {product?.stats?.score?.total ? (
        <CustomTag color="orange">
          {product.stats.score.total} marks
          <Divider type="vertical" />
        </CustomTag>
      ) : null}
      {product?.products?.test ? (
        <CustomTag color="purple">
          {product?.products?.test?.length} Tests
          <Divider type="vertical" />
        </CustomTag>
      ) : null}

      {product?.stats?.question?.count ? (
        <CustomTag color="red">
          {product.stats.question.count} Questions
          <Divider type="vertical" />
        </CustomTag>
      ) : null}
    </MiniCard>
  ) : (
    <Card
      onClick={() => props.onClick && props.onClick()}
      hoverable
      bodyStyle={{ padding: "20px 10px" }}
      // cover={
      //   <AppImage
      //     placeholder
      //     height={120}
      //     alt="example"
      //     src={product.thumbnailImage}
      //   />
      // }
      actions={props.actions}
    >
      <Card.Meta
        description={props.children}
        title={<Text>{product.title}</Text>}
      />
    </Card>
  );
  if (product.plan.type === "free") {
    return (
      <Badge.Ribbon placement="start" text="Free">
        {Component}
      </Badge.Ribbon>
    );
  } else {
    return Component;
  }
  return Component;
};

export default LearnerProductCard;
