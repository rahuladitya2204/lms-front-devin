import { Badge, Button, Card, Col, Empty, Row, Spin } from "antd";
import { Enum, Learner, Types, User, Utils } from "@adewaskar/lms-common";
import { useMemo, useState } from "react";

import AppImage from "@Components/Image";
import { CheckOutlined } from "@ant-design/icons";
import Tabs from "@Components/Tabs";
import { Typography } from "./Typography";
import { copyToClipboard } from "@Utils/index";

const { Text } = Typography;
interface UserProductCardPropsI {
  product: Types.Product;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
}

const UserProductCard = (props: UserProductCardPropsI) => {
  const {
    product: { type, id },
  } = props;
  const { data: product } = User.Queries.useGetProductDetail({ type, id });
  // console.log(product, id, '1321')
  const Component = <Card
    hoverable
    bodyStyle={{ padding: "20px 10px" }}
    cover={
      <AppImage height={80} alt="example" src={product.thumbnailImage} />
    }
    actions={props.actions}
  >
    <Card.Meta
      description={props.children}
      title={<Text>{product.title}</Text>}
    />
  </Card>;

  if (product?.plan?.finalPrice) {
    return <Badge.Ribbon text={Utils.UnitTypeToStr(product.plan.finalPrice)}>{Component}</Badge.Ribbon>
  }
  else {
    return <Badge.Ribbon color='red-inverse' text={`Plan Missing`}>{Component}</Badge.Ribbon>
  }

  return Component
};

export default UserProductCard;
