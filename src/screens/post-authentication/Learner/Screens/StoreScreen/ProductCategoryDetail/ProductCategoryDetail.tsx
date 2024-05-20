"use client";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  List,
  Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  message,
} from "@Lib/index";
import {
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  InfoCircleFilled,
  InfoOutlined,
  NotificationOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { Constants, Enum, Learner, Utils } from "@adewaskar/lms-common";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import Icon, { HomeOutlined } from "@ant-design/icons";
import { Link, NavLink, useNavigate, useParams } from "@Router/index";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import PackageCard from "../Cards/PackageCard";
import ProductCategoryMetadata from "./ProductCategoryMetadata";
import Tabs from "@Components/Tabs";
// import Tabs from '@Components/Tabs'
import Title from "antd/es/typography/Title";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { Outlet } from "react-router";
import ProductCategoryDetailSkeletonScreen from "./ProductCategoryDetailSkeleton";
import TestCard from "../Cards/TestCard";
import ProductCategoryTabs, {
  PackageListComponent,
  TestListComponent,
} from "./ProductCategoryTabs";
import PromotedProducts from "./PromotedProducts";

const { Text, Paragraph } = Typography;

interface ProductCategoryDetailScreenPropsI {
  isServer?: boolean;
  children?: React.ReactNode;
  product?: string;
}

export default function ProductCategoryDetailScreen(
  props: ProductCategoryDetailScreenPropsI
) {
  const navigate = useNavigate();
  const { id: productCategoryId, type = "overview", product } = useParams();
  const { isMobile, width } = useBreakpoint();
  // const loadingProductCategory = true;
  const { data: productCategory, isLoading: loadingProductCategory } =
    Learner.Queries.useGetProductCategoryDetails(productCategoryId + "");

  useEffect(() => {
    if (!type && !props.isServer) {
      navigate(`/app/exam/${productCategoryId}/overview`);
    }
  }, [type]);

  const Metadata = (
    <ProductCategoryMetadata productCategory={productCategory} />
  );

  const Banners = productCategory.info.updates.filter((i) => i.displayAsBanner);
  return loadingProductCategory ? (
    <ProductCategoryDetailSkeletonScreen />
  ) : (
    <Row gutter={[20, 10]}>
      <>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Row justify={"space-between"} align={"middle"}>
            <Col lg={21}>
              <Row>
                <Col
                  style={{
                    margin: isMobile ? "auto" : 0,
                    marginBottom: isMobile ? 15 : "auto",
                  }}
                  lg={3}
                >
                  <Avatar
                    style={{ width: 100, height: 100 }}
                    src={productCategory.thumbnailImage}
                  />
                </Col>
                <Col lg={18} style={{ display: "flex", alignItems: "center" }}>
                  <Title
                    style={{
                      // fontSize: 16,
                      whiteSpace: "normal", // Ensures text wraps
                      overflowWrap: "break-word", // Breaks words to prevent overflow
                      margin: 0,
                      textAlign: isMobile ? "center" : "left",
                      fontSize: isMobile ? 18 : 25,
                    }}
                    level={5}
                  >
                    {productCategory.subtitle}
                    <br />
                    {isMobile ? (
                      <span>
                        (
                        <ThunderboltFilled
                          style={{ color: "goldenrod", fontSize: 25 }}
                        />
                        Upcoming)
                      </span>
                    ) : null}
                  </Title>
                  {/* <Title
                    style={{
                      // fontSize: 16,
                      whiteSpace: "normal", // Ensures text wraps
                      overflowWrap: "break-word", // Breaks words to prevent overflow
                      margin: isMobile ? 10 : 0,
                      textAlign: isMobile ? "center" : "left",
                    }}
                    level={5}
                  >
                    {productCategory.title}
                  </Title> */}
                </Col>
              </Row>
            </Col>
            {productCategory.info.isUpcoming && !isMobile ? (
              <Col
                style={{ display: "flex", flexDirection: "row-reverse" }}
                lg={3}
              >
                <Row align={"middle"}>
                  <Col>
                    <ThunderboltFilled
                      style={{
                        color: "goldenrod",
                        fontSize: 30,
                        marginRight: 5,
                      }}
                    />
                  </Col>
                  <Col>
                    <Text style={{ fontSize: 22 }} strong>
                      Upcoming
                    </Text>
                  </Col>
                </Row>
              </Col>
            ) : null}
          </Row>
          <Row>
            <Col span={24} style={{ marginTop: 20 }}>
              <Card>{Metadata}</Card>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }} gutter={[20, 20]}>
            <Col span={24}>
              {Banners.length ? (
                <Badge.Ribbon
                  color="orange-inverse"
                  placement="start"
                  text={
                    productCategory.title
                      ? `${productCategory.title} latest updates`
                      : null
                  }
                >
                  <Card style={{ paddingTop: 20 }}>
                    {Banners.map((i, idx) => {
                      return (
                        <Col span={24} key={idx}>
                          <Alert
                            type="error"
                            action={
                              <Tag color="orange-inverse">
                                {dayjs(i.date).format("L")}
                              </Tag>
                            }
                            icon={<NotificationOutlined />}
                            message={<strong>{i.title}</strong>}
                            description={<HtmlViewer content={i.description} />}
                          />
                        </Col>
                      );
                    })}
                  </Card>
                </Badge.Ribbon>
              ) : null}
            </Col>
          </Row>
        </Col>
      </>

      <Col span={24}>
        <Row gutter={[30, 30]}>
          <CategoryProducts
            type={type + ""}
            isServer={props.isServer}
            categoryId={productCategoryId + ""}
            product={product + ""}
          />
          <Col xs={24} sm={24} md={24} lg={24}>
            <Row>
              {productCategory.landingPage?.promoVideo?.url ? (
                // <Card style={{ paddingTop: 0, minHeight: 400 }}>
                <Col span={24}>
                  <MediaPlayer
                    thumbnail={
                      productCategory.landingPage.promoVideo.thumbnailImage
                    }
                    height={400}
                    url={productCategory.landingPage.promoVideo.url}
                  />
                  <Divider />
                </Col>
              ) : // </Card>
              null}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

interface CategoryProductsPropsI {
  categoryId: string;
  type: string;
  isServer?: boolean;
  product: string;
  children?: string;
}

export const CategoryProducts = (props: CategoryProductsPropsI) => {
  const { categoryId, type, product } = props;
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetails(categoryId);
  const { data: packages, isLoading: loadingPackages } =
    Learner.Queries.useGetPackages(categoryId, {
      enabled: !!categoryId,
    });

  const navigate = useNavigate();

  const { isDesktop } = useBreakpoint();
  const { data: PYQTests, isLoading: loadingPYQs } = Learner.Queries.useGetPYQs(
    categoryId,
    {
      enabled: !!categoryId,
    }
  );
  const link = category.info.links.find((i) => i.slug === type);
  const TABS = useMemo(() => {
    const tabs: any[] = [];
    if (packages.length) {
      tabs.push({
        label: "Test Series",
        key: "test-series",
        children: (
          <Row>
            <Col span={24}>
              <Title style={{ fontSize: 16 }} level={4}>
                {category.title} Test Series
              </Title>
              <PromotedProducts
                data={{
                  category: categoryId,
                  keywords: link?.keywords,
                  limit: 3,
                }}
                category={categoryId}
                type={Enum.ProductType.PACKAGE}
                isServer={!!props.isServer}
              />
            </Col>
            <Col span={24}>
              <Title style={{ fontSize: 16 }} level={4}>
                {category.title} Free Tests
              </Title>
              <PromotedProducts
                data={{
                  category: categoryId,
                  mode: "free",
                  keywords: link?.keywords,
                  limit: 3,
                }}
                category={categoryId}
                type={Enum.ProductType.TEST}
                isServer={!!props.isServer}
              />
            </Col>
          </Row>
        ),
      });
    }
    if (PYQTests.length) {
      tabs.push({
        label: "Previous Year Papers",
        key: "previous-year-questions",
        children: (
          <PYQTestsComponent
            isServer={props.isServer}
            categoryId={categoryId}
            showAll
          />
        ),
      });
    }
    return tabs;
  }, [packages, PYQTests]);
  const [productTab, setProductTab] = useState("test-series");
  // console.log(product, "product");
  return TABS.length ? (
    <>
      <Col span={24}>
        <Card bodyStyle={{ paddingTop: 0 }}>
          <Tabs
            onTabClick={(e) => {
              console.log(e, "eeee");
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
      <Col span={24}>
        {props.children ? (
          props.children
        ) : (
          <ProductCategoryTabs isServer={props.isServer} />
        )}
      </Col>
    </>
  ) : null;
};

export const PYQTestsComponent = (props: {
  isServer: boolean;
  showAll?: boolean;
  categoryId: string;
}) => {
  const { categoryId } = props;
  const { data: PYQTests, isLoading: loadingPYQs } = Learner.Queries.useGetPYQs(
    categoryId,
    {
      enabled: !!categoryId,
    }
  );
  const navigate = useNavigate();
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetails(categoryId);
  return (
    <Row gutter={[20, 20]}>
      {PYQTests.sort((a) => a.pyq.year).map((test, idx) => {
        return (
          <Col sm={12} key={idx} md={8} xs={24} lg={8} xl={6} xxl={6}>
            <TestCard
              hideMeta
              noClick
              hideCoverImg
              isServer={props.isServer}
              test={test}
            >
              <Row gutter={[20, 10]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={12}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        // props.isServer
                        //   ? `/test/${test._id}`
                        //   :
                        `/app/test/${test.slug || test._id}`
                      );
                    }}
                    block
                    type="primary"
                  >
                    <BookOutlined /> Attempt Now
                  </Button>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={12}>
                  <Link
                    to={`/test/${
                      test.slug || test._id
                    }/previous-year-questions`}
                  >
                    <Button type="dashed" block danger>
                      <BookOutlined /> View Analysis
                    </Button>
                  </Link>
                </Col>
              </Row>
            </TestCard>
          </Col>
        );
      })}
      {props.showAll ? (
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => {
              if (props.isServer) {
                navigate(
                  `/previous-year-papers/${category.testSeries.page.slug}`
                );
              } else {
                navigate(
                  `/app/previous-year-papers/${category.testSeries.page.slug}`
                );
              }
            }}
            type="dashed"
            size="small"
          >
            View All Papers
          </Button>
        </Col>
      ) : null}
    </Row>
  );
};
