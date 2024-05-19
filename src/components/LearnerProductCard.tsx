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
} from "@Lib/index";
import { Enum, Learner, Types, User } from "@adewaskar/lms-common";
import AppImage from "@Components/Image";
import { Text, Title } from "./Typography/Typography";
import MiniCard from "@Screens/post-authentication/Learner/Screens/StoreScreen/Cards/MiniCard";

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
    >
      <Title style={{ fontSize: 13 }}>{product.title}</Title>
      {props.children}
      <Divider style={{ margin: "10px 0" }} />
      {product.duration.enabled ? (
        <Tag style={{ fontSize: 12 }} color="blue">
          {product.duration.value} mins
        </Tag>
      ) : null}
      {product?.stats?.score?.total ? (
        <Tag style={{ fontSize: 12 }} color="orange">
          {product.stats.score.total} marks
        </Tag>
      ) : null}

      {product?.stats?.question?.count ? (
        <Tag style={{ fontSize: 12 }} color="red">
          {product.stats.question.count} Questions
        </Tag>
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
