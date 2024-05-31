import { Enum, Learner, Types } from "@adewaskar/lms-common";
import { Col, Row } from "antd";
import PackageCard from "../Cards/PackageCard";
import TestCard from "../Cards/TestCard";
import LearnerProductCard from "@Components/LearnerProductCard";
import { Link } from "@Router/index";
import { useMemo } from "react";
import { Title } from "@Components/Typography/Typography";

interface PromotedProductsPropsI {
  isServer: boolean;
  categoryId: string;
  type?: string;
  data: any;
}

export default function PromotedProducts(props: PromotedProductsPropsI) {
  const { categoryId, type } = props;
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetails(categoryId);
  // console.log(category.keywords, link?.keywords, "keywords");
  const link = category.info.links.find((i) => i.slug === type);
  const keywords = link?.keywords || category.keywords;

  const { data: packages } = Learner.Queries.useGetPromotedProducts(
    Enum.ProductType.PACKAGE,
    {
      category: categoryId,
      ...(keywords?.length ? { keywords: keywords } : {}),
      ...(props.data || {}),
      limit: 3,
    }
  );

  const { data: tests } = Learner.Queries.useGetPromotedProducts(
    Enum.ProductType.TEST,
    {
      category: categoryId,
      mode: "free",
      ...(keywords?.length ? { keywords: keywords } : {}),
      limit: 3,
    }
  );

  // console.log(linkPrefix, props.type, "popopo");
  return (
    <Row>
      {packages.length ? (
        <Col span={24}>
          <Title style={{ fontSize: 16 }} level={4}>
            {category.title} Test Series
          </Title>
          <Row gutter={[20, 20]}>
            {packages.map((bundle) => {
              return (
                <Col
                  sm={12}
                  key={bundle._id}
                  md={12}
                  xs={24}
                  lg={12}
                  xl={8}
                  xxl={8}
                >
                  <LearnerProductCard
                    isServer={props.isServer}
                    mini
                    product={bundle}
                  />
                </Col>
              );
            })}
          </Row>
        </Col>
      ) : null}
      <Col span={24}>
        <Title style={{ fontSize: 16 }} level={4}>
          {category.title} Mock Tests
        </Title>
        <Row gutter={[20, 20]}>
          {tests.map((test) => {
            return (
              <Col
                sm={12}
                key={test._id}
                md={12}
                xs={24}
                lg={12}
                xl={8}
                xxl={8}
              >
                <LearnerProductCard
                  isServer={props.isServer}
                  mini
                  product={test}
                />
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}
