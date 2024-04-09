import { Button, Card, Col, Empty, Row, Skeleton, Spin } from "@Lib/index";
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
    product: { data: product },
  } = props;

  return (
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
