import { Enum, Learner } from "@adewaskar/lms-common";
import { Col, Row } from "antd";
import PackageCard from "../Cards/PackageCard";
import TestCard from "../Cards/TestCard";
import LearnerProductCard from "@Components/LearnerProductCard";

interface PromotedProductsPropsI {
  type: string;
  mode: string;
  isServer: boolean;
  data?: any;
}

export default function PromotedProducts(props: PromotedProductsPropsI) {
  const { data: products } = Learner.Queries.useGetPromotedProducts(
    props.type,
    {
      mode: props.mode,
      ...(props.data ? props.data : {}),
    }
  );
  console.log(products, "popopo");
  return (
    <Row gutter={[20, 20]}>
      {products.map((product, idx) => {
        return (
          <Col sm={12} key={idx} md={12} xs={24} lg={12} xl={8} xxl={6}>
            <LearnerProductCard
              mini
              // isServer={props.isServer}
              product={product}
            />
          </Col>
        );
      })}
    </Row>
  );
}
