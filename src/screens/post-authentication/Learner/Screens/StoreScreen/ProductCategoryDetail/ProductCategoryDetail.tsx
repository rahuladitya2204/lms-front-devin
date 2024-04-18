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
import React, { Fragment, useEffect, useMemo } from "react";
import Icon, { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@Router/index";
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

const { Text, Paragraph } = Typography;

interface ProductCategoryDetailScreenPropsI {
  isServer?: boolean;
  children?: React.ReactNode;
}

export default function ProductCategoryDetailScreen(
  props: ProductCategoryDetailScreenPropsI
) {
  const navigate = useNavigate();
  const { id: productCategoryId, type } = useParams();
  const { isMobile, width } = useBreakpoint();
  // const loadingProductCategory = true;
  const { data: productCategory, isLoading: loadingProductCategory } =
    Learner.Queries.useGetProductCategoryDetails(productCategoryId + "");
  const { data: packages, isLoading: loadingPackages } =
    Learner.Queries.useGetPackages(productCategory._id, {
      enabled: !!productCategory._id,
    });

  const { data: PYQTests, isLoading: loadingPYQs } = Learner.Queries.useGetPYQs(
    productCategory._id,
    {
      enabled: !!productCategory._id,
    }
  );

  useEffect(() => {
    if (!type && !props.isServer) {
      navigate(`/app/category/${productCategoryId}/overview`);
    }
  }, [type]);

  const Metadata = (
    <ProductCategoryMetadata productCategory={productCategory} />
  );
  const PackageListComponent = (
    <Row gutter={[20, 20]}>
      {loadingPackages
        ? [1, 1, 1, 1, 1, 1].map((i, idx) => (
            <Col sm={12} key={idx} md={8} xs={24} lg={8} xl={6} xxl={6}>
              <Skeleton.Button active block style={{ height: 200 }} />
            </Col>
          ))
        : packages.map((bundle, idx) => {
            return (
              <Col sm={12} key={idx} md={8} xs={24} lg={8} xl={6} xxl={6}>
                <PackageCard isServer={props.isServer} package={bundle} />
              </Col>
            );
          })}
    </Row>
  );
  const { isDesktop } = useBreakpoint();
  const PYQTestsComponent = (
    <Row gutter={[20, 20]}>
      {PYQTests.sort((a) => a.pyq.year).map((test, idx) => {
        return (
          <Col sm={12} key={idx} md={8} xs={24} lg={8} xl={6} xxl={6}>
            <TestCard hideCoverImg isServer={props.isServer} test={test}>
              <Row gutter={[20, 10]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={12}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        // props.isServer
                        //   ? `/test/${test._id}`
                        //   :
                        `/app/test/${test._id}`
                      );
                    }}
                    block
                    type="primary"
                  >
                    <BookOutlined /> Attemp Now
                  </Button>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={12}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/app/test/${test._id}/pyq`);
                    }}
                    type="dashed"
                    block
                    danger
                  >
                    <BookOutlined /> View Analysis
                  </Button>
                </Col>
              </Row>
            </TestCard>
          </Col>
        );
      })}
    </Row>
  );

  const TABS = useMemo(() => {
    const tabs: any[] = [];
    if (packages.length) {
      tabs.push({
        label: "Test Series",
        key: "test-series",
        children: PackageListComponent,
      });
    }
    if (PYQTests.length) {
      tabs.push({
        label: "Previous Year Papers",
        key: "pyq",
        children: PYQTestsComponent,
      });
    }
    return tabs;
  }, [packages, PYQTests]);
  const Banners = productCategory.info.updates.filter((i) => i.displayAsBanner);
  return loadingProductCategory ? (
    <ProductCategoryDetailSkeletonScreen />
  ) : (
    <Row gutter={[20, 10]}>
      <>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Row justify={"space-between"} align={"middle"}>
            <Col sm={isMobile ? 24 : 18} xs={24}>
              <Row align={"middle"}>
                <Col
                  style={{
                    margin: isMobile ? "auto" : 0,
                    marginBottom: isMobile ? 15 : "auto",
                  }}
                >
                  <Avatar
                    style={{ width: 100, height: 100 }}
                    src={productCategory.thumbnailImage}
                  />
                </Col>
                <Col flex={1} style={{ marginLeft: 15 }}>
                  <Title
                    style={{
                      // fontSize: 16,
                      whiteSpace: "normal", // Ensures text wraps
                      overflowWrap: "break-word", // Breaks words to prevent overflow
                      margin: 0,
                      textAlign: isMobile ? "center" : "left",
                      fontSize: 25,
                    }}
                    level={1}
                  >
                    {productCategory.subtitle}
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
                sm={6}
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
          {packages.length ? (
            <Col span={24}>
              <Card
              // title="Try our test series!"
              >
                {TABS.length > 1 ? <Tabs items={TABS} /> : TABS[0].children}
              </Card>
            </Col>
          ) : null}
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card style={{ paddingTop: 0, minHeight: 400 }}>
              <Row>
                {productCategory.landingPage?.promoVideo?.url ? (
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
                ) : null}
                <Col span={24}>
                  <Row>
                    {/* <Col span={24}>
                        <Card title='Try our test series!'>
                        <Row gutter={[20,20]}>
                          {packages.map(bundle => {
                          return <Col   sm={12} 
                          md={8} xs={24}
                            lg={8} xl={6} xxl={6}  >
                            <PackageCard package={bundle} />
                          </Col>
                        })}
                        </Row>
                        </Card>
                      </Col> */}
                    <Col span={24}>
                      {props.isServer ? (
                        props.children
                      ) : (
                        // <ProductCategoryTabs id={productCategoryId + ""} />
                        <Outlet />
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}></Col>
              </Row>
            </Card>
          </Col>
          {productCategory?.info?.faqs?.length ? (
            <Col lg={24} md={24} sm={24} xs={24}>
              <Card title="FAQs">
                {productCategory.info.faqs.map((faq, idx) => {
                  return (
                    <Collapse
                      expandIconPosition="end"
                      style={{ marginTop: 10 }}
                      key={idx}
                      items={[
                        {
                          label: faq.title,
                          children: <Paragraph>{faq.description}</Paragraph>,
                        },
                      ]}
                    />
                  );
                })}
              </Card>
            </Col>
          ) : null}
        </Row>
      </Col>
    </Row>
  );
}
