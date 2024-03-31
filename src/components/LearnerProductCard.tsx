import { Button, Card, Col, Empty, Row, Skeleton, Spin } from "antd";
import { Enum, Learner, Types, User } from "@adewaskar/lms-common";

import AppImage from "@Components/Image";
import { Text } from "./Typography/Typography";

interface LearnerProductCardPropsI {
  product: Types.Product;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
  onClick?: Function;
}

const LearnerProductCard = (props: LearnerProductCardPropsI) => {
  const {
    product: { type, id },
  } = props;
  const { data: product, isLoading: loading } =
    Learner.Queries.useGetProductDetail({ type, id });
  // console.log(type, id, '1321')

  return loading ? (
    <Skeleton.Button style={{ height: 178 }} block />
  ) : (
    <Card
      onClick={() => props.onClick && props.onClick()}
      hoverable
      bodyStyle={{ padding: "20px 10px" }}
      cover={
        <AppImage
          placeholder
          height={120}
          alt="example"
          src={product.thumbnailImage}
        />
      }
      actions={props.actions}
    >
      <Card.Meta
        description={props.children}
        title={<Text>{product.title}</Text>}
      />
    </Card>
  );
};

export default LearnerProductCard;
