"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Paragraph, Text, Title } from "@Components/Typography/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import { Link, NavLink, useNavigate, useParams } from "@Router/index";
import { Enum, Learner } from "@adewaskar/lms-common";
import styled from "@emotion/styled";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Row,
  Skeleton,
  Tabs,
} from "@Lib/index";
import { useMemo, useState } from "react";
import { Outlet } from "react-router";
import ShowMore from "@Components/ShowMore/ShowMore";
import PackageCard from "../Cards/PackageCard";
import { FAQsList } from "@Components/CreateFaqsComponent";
import Script from "next/script";
import { DownOutlined } from "@ant-design/icons";
import TestCard from "../Cards/TestCard";

import PromotedProducts from "./PromotedProducts";
import { PYQTestsComponent } from "./ProductCategoryDetail";
import LearnerProductCard from "@Components/LearnerProductCard";

const CustomTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin-left: 15px;
  }

  .ant-tabs-tab-active {
  }
`;

interface ProductCategoryTabsPropsI {
  id?: string;
  type?: string;
  isServer?: boolean;
  product?: string;
  url: string;
  // children?: string;
}

export default function ProductCategoryTabs(props: ProductCategoryTabsPropsI) {
  const params = useParams();
  const id = props.id || params.id;
  const type = props.type || params.type || "overview";
  // debugger;
  // const product = props.product || params.product || "packages";
  const { data: productCategory, isLoading: loadingCategory } =
    Learner.Queries.useGetProductCategoryDetails(id + "");
  const TABS = useMemo(() => {
    const i = [
      {
        label: "Overview",
        key: "overview",
        displayOnLandingPage: true,
        description: productCategory.landingPage.description,
        children: productCategory.landingPage.description,
        faqs: productCategory.info.faqs,
        seo: productCategory.seo,
      },
    ];

    i.push(
      ...productCategory.info.links
        // .filter((l) => l.displayOnLandingPage)
        .map((link) => {
          return {
            label: link?.displayOnLandingPage?.cta?.text || link.title,
            displayOnLandingPage: link?.displayOnLandingPage?.enabled,
            key: link.slug,
            description: link.description,
            children: link.description,
            faqs: link.faqs,
            seo: link.seo,
          };
        })
    );

    return i;
  }, [productCategory, type]);
  const navigate = useNavigate();
  const tab = TABS.find((tab) => tab.key === type);
  return loadingCategory ? (
    <ProductCategoryTabsSkeleton />
  ) : (
    <Row gutter={[0, 20]}>
      <Col span={24} style={{ marginTop: 15 }}>
        <Row>
          <Col>
            {TABS.filter((i) => i?.displayOnLandingPage).map((tab) => {
              return (
                <Button
                  onClick={() => {
                    navigate(
                      props.isServer
                        ? `/exam/${id}/${tab.key}`
                        : `/app/exam/${id}/${tab.key}`
                    );
                  }}
                  // type="text"
                  size="small"
                  type={tab.key === type ? "primary" : "default"}
                  style={{ marginRight: 15, marginBottom: 10 }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Col>
          <Col>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: TABS.filter((tab) => !tab?.displayOnLandingPage).map(
                  (i) => {
                    return {
                      label: i.label,
                      key: i.key,
                      onClick: () => {
                        navigate(
                          props.isServer
                            ? `/exam/${id}/${i.key}`
                            : `/app/exam/${id}/${i.key}`
                        );
                      },
                    };
                  }
                ),
              }}
            >
              <Button type="dashed" danger size="small">
                View all <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <CategoryProducts
          type={type + ""}
          isServer={props.isServer}
          categoryId={id + ""}
        />
      </Col>
      <Col span={24}>
        <Card>
          <PageSchema url={props.url} seo={tab?.seo} />
          {/* <Divider style={{ margin: "5px 0px 20px 0" }} /> */}
          {
            <ShowMore minHeight={600}>
              {tab?.children ? (
                <HtmlViewer
                  customStyles={`
              .html-viewer img,figure {
                border-radius: 10px;
                width: 100% !important;
                height: auto !important;
                display: block !important;
                margin: auto !important;
              }
              .html-viewer img {
                width: 100% !important;
              }
              `}
                  content={tab.children}
                />
              ) : (
                <HtmlViewer content={tab?.description + ""} />
              )}
            </ShowMore>
          }
        </Card>
      </Col>
      {tab?.faqs?.length ? (
        <Col lg={24} md={24} sm={24} xs={24}>
          <Card title="FAQs">
            <FAQsList faqs={tab?.faqs} />
          </Card>
        </Col>
      ) : null}
    </Row>
  );
}

export const PageSchema = ({ seo, url }) => {
  return (
    <Script
      id="exam-script"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: seo?.title,
          description: seo?.description,
          url: url,
        }),
      }}
    ></Script>
  );
};

interface CategoryProductsPropsI {
  categoryId: string;
  type: string;
  isServer?: boolean;
  children?: string;
}

const CategoryProducts = (props: CategoryProductsPropsI) => {
  const { categoryId, type } = props;
  const { data: PYQTests, isLoading: loadingPYQs } = Learner.Queries.useGetPYQs(
    categoryId,
    {
      enabled: !!categoryId,
    }
  );
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
      limit: 3,
    }
  );
  const TABS = useMemo(() => {
    const tabs: any[] = [];
    if (packages.length) {
      tabs.push({
        label: "Test Series",
        key: "test-series",
        children: (
          <ShowMore minHeight={200}>
            <PromotedProducts
              categoryId={categoryId}
              type={props.type}
              isServer={!!props.isServer}
            />
          </ShowMore>
        ),
      });
    }

    if (PYQTests.length) {
      tabs.push({
        label: "Previous Year Papers",
        key: "previous-year-questions",
        children: (
          <ShowMore minHeight={200}>
            <PYQTestsComponent
              isServer={!!props.isServer}
              categoryId={categoryId}
              showAll
            />
          </ShowMore>
        ),
      });
    }
    return tabs;
  }, [PYQTests, categoryId, type, packages]);
  const [productTab, setProductTab] = useState("test-series");

  return (
    <>
      {TABS.length ? (
        <Col span={24}>
          <Card bodyStyle={{ paddingTop: 0 }}>
            <Tabs
              onTabClick={(e) => {
                setProductTab(e);
              }}
              items={TABS}
              // tabBarExtraContent={{
              //   right:
              //     productTab === "test-series" ? (
              //       <Button
              //         onClick={() => {
              //           if (props.isServer) {
              //             navigate(
              //               `/test-series/${category.testSeries.page.slug}`
              //             );
              //           } else {
              //             navigate(
              //               `/app/test-series/${category.testSeries.page.slug}`
              //             );
              //           }
              //         }}
              //         type="dashed"
              //         size="small"
              //       >
              //         View All Test Series
              //       </Button>
              //     ) : (
              //       <Button
              //         onClick={() => {
              //           if (props.isServer) {
              //             navigate(
              //               `/previous-year-questions/${category.testSeries.page.slug}`
              //             );
              //           } else {
              //             navigate(
              //               `/app/previous-year-questions/${category.testSeries.page.slug}`
              //             );
              //           }
              //         }}
              //         type="dashed"
              //         size="small"
              //       >
              //         View All PYQ Papers
              //       </Button>
              //     ),
              // }}
            />
          </Card>
        </Col>
      ) : null}
    </>
  );
};

export const ProductCategoryTabsSkeleton = () => {
  return (
    <Row gutter={[20, 15]}>
      {/* <Divider style={{ margin: 0 }} /> */}
      <Col span={24}>
        <Row gutter={[15, 10]}>
          {[1, 1, 1, 1, 1, 1, 1].map(() => (
            <Col>
              <Skeleton.Button block style={{ height: 25, width: 90 }} active />
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={24}>
        <Skeleton.Button block style={{ height: 400 }} active />
      </Col>
      {/* <Divider style={{ margin: 0 }} /> */}
      <Col span={24}>
        <Skeleton.Button block style={{ height: 400 }} active />
      </Col>
    </Row>
  );
};
