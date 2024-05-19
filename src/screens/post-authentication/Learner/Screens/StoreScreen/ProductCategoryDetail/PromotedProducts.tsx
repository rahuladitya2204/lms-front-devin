import { Enum, Learner } from "@adewaskar/lms-common";
import { Col, Row } from "antd";
import PackageCard from "../Cards/PackageCard";
import TestCard from "../Cards/TestCard";
import LearnerProductCard from "@Components/LearnerProductCard";
import { Link } from "@Router/index";
import { useMemo } from "react";

interface PromotedProductsPropsI {
  type: Enum.ProductType;
  category: string;
  isServer: boolean;
  data?: any;
}

export default function PromotedProducts(props: PromotedProductsPropsI) {
  const query = {
    ...(props.data ? props.data : {}),
  };
  // console.log(query, props.type, "query");
  // const { data: category } = Learner.Queries.useGetProductCategoryDetails(
  //   props.category,
  //   {
  //     enabled: !!props.category,
  //   }
  // );
  const { data: products } = Learner.Queries.useGetPromotedProducts(
    props.type,
    query
  );
  console.log(props.type, "props.type");
  const linkPrefix = useMemo(() => {
    let prefix = "test";
    switch (props.type) {
      case "test": {
        prefix = "test";
        break;
      }
      case "package": {
        prefix = "test-series";
        break;
      }
      default: {
        prefix = "test";
      }
    }
    return prefix;
  }, [props]);
  console.log(linkPrefix, props.type, "popopo");
  return (
    <Row gutter={[20, 20]}>
      {products.map((product, idx) => {
        return (
          <Col sm={12} key={idx} md={12} xs={24} lg={12} xl={8} xxl={8}>
            <Link
              to={
                props.isServer
                  ? `/${linkPrefix}/${product.id}`
                  : `/app/${linkPrefix}/${product.id}`
              }
            >
              <LearnerProductCard
                mini
                // isServer={props.isServer}
                product={product}
              />
            </Link>
          </Col>
        );
      })}
    </Row>
  );
}
