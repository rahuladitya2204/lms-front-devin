import { Enum, Learner, Types } from "@adewaskar/lms-common";
import { Col, Row } from "antd";
import LearnerProductCard from "@Components/LearnerProductCard";
import { useEffect } from "react";
import { Title } from "@Components/Typography/Typography";
import { LogEvent } from "@ServerHooks/useDehydration";

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

  const { data: link } =
    Learner.Queries.useGetProductCategoryLinkDetails(categoryId, type + '');
  const keywords = link?.keywords;

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

  useEffect(() => {
    if (packages.length) {
      LogEvent("Category", "Promoted Packages::Loaded", category.title, {
        categoryId: category._id,
      }); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    }
  }, [packages]);

  useEffect(() => {
    if (tests.length) {
      LogEvent("Category", "Promoted Tests::Loaded", category.title, {
        categoryId: category._id,
      }); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    }
  }, [tests]);

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
                  <div style={{ marginLeft: 10 }}>
                    <LearnerProductCard
                      onTry={() => {
                        LogEvent(
                          "Category",
                          "PromotedProducts:Package::Clicked",
                          category.title,
                          {
                            categoryId: category._id,
                          }
                        );
                      }}
                      isServer={props.isServer}
                      mini
                      product={bundle}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
      ) : null}
      {tests.length ? (
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
                  <div style={{ marginLeft: 10 }}>
                    <LearnerProductCard
                      isServer={props.isServer}
                      mini
                      product={test}
                      onTry={() => {
                        LogEvent(
                          "Category",
                          "PromotedProducts:Package::Clicked",
                          category.title,
                          {
                            categoryId: category._id,
                          }
                        );
                      }}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
      ) : null}
    </Row>
  );
}
