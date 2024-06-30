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
  Form,
  Input,
  List,
  Row,
  Skeleton,
  Space,
  Spin,
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
import {
  Constants,
  Enum,
  Learner,
  Store,
  Types,
  Utils,
} from "@adewaskar/lms-common";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import Icon, { HomeOutlined } from "@ant-design/icons";
import {
  Link,
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "@Router/index";
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
import ProductCategoryTabs from "./ProductCategoryTabs";
import PromotedProducts from "./PromotedProducts";
import AppImage from "next/image";
import ShowMore from "@Components/ShowMore/ShowMore";
import { useModal } from "@Components/ActionModal/ModalContext";
import LearnerLogin from "../../Login";

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
  const [searchParams] = useSearchParams();
  const [displayBanner, setDisplayBanner] = useState(false);
  const { openModal } = useModal();
  const { id: productCategoryId, type = "overview", product } = useParams();
  const { isMobile, width } = useBreakpoint();
  // const loadingProductCategory = true;
  const { data: productCategory, isLoading: loadingProductCategory } =
    Learner.Queries.useGetProductCategoryDetails(productCategoryId + "");
  const hidePopup =
    localStorage.getItem("hide_popup") || searchParams.get("hide_popup");
  // console.log(hidePopup, "hide popup");
  useEffect(() => {
    if (!type && !props.isServer) {
      navigate(`/app/exam/${productCategoryId}/overview`);
    }
  }, [type]);

  const Metadata = (
    <ProductCategoryMetadata productCategory={productCategory} />
  );

  // const Banners = productCategory.info.updates.filter((i) => i.displayAsBanner);
  const { isSignedIn, isLoading } = Store.useAuthentication((s) => s);
  // const { data: learner } = Learner.Queries.useGetLearnerDetails();
  useEffect(() => {
    setTimeout(() => {
      console.log(isSignedIn, productCategory, "learnerlearner");
      if (
        !isLoading &&
        !isSignedIn &&
        productCategory._id &&
        !displayBanner &&
        !hidePopup
      ) {
        openModal(<ProductDetailSignup category={productCategory} />);
        localStorage.setItem("hide_popup", "true");
      }
    }, 5000);
  }, [isSignedIn, productCategory, hidePopup]);

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
                  <AppImage
                    alt={productCategory.title}
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
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
                    <Text style={{ fontSize: 22 }}>Upcoming</Text>
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
          {/* <Row style={{ marginTop: 20 }} gutter={[20, 20]}>
            <Col span={24}>
              <Badge.Ribbon
                color="orange-inverse"
                placement="start"
                text={
                  productCategory.title
                    ? // ? `${productCategory.title} latest updates`
                      `Latest Updates`
                    : null
                }
              >
                {" "}
                <Card>
                  {Banners.length ? (
                    <Collapse>
                      <Collapse.Panel
                        header={
                          productCategory.title
                            ? `${productCategory.title} Latest Updates`
                            : null
                        }
                      >
                        <Row gutter={[20, 20]}>
                          {" "}
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
                                  description={
                                    <ShowMore minHeight={100}>
                                      {" "}
                                      <HtmlViewer content={i.description} />
                                    </ShowMore>
                                  }
                                />
                              </Col>
                            );
                          })}
                        </Row>
                      </Collapse.Panel>
                    </Collapse>
                  ) : null}
                </Card>
              </Badge.Ribbon>
            </Col>
          </Row> */}
        </Col>
      </>

      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col span={24}>
            {props.children ? (
              props.children
            ) : (
              <ProductCategoryTabs isServer={props.isServer} />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

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
                    // type="primary"
                  >
                    <BookOutlined /> Attempt Now
                  </Button>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={12}>
                  <Link
                    to={
                      props.isServer
                        ? `/test/${
                            test.slug || test._id
                          }/previous-year-questions`
                        : `/app/test/${
                            test.slug || test._id
                          }/previous-year-questions`
                    }
                  >
                    <Button type="primary" block danger>
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

const ProductDetailSignup = ({
  category,
}: {
  category: Types.ProductCategory;
}) => {
  return (
    <Row gutter={[10, 20]}>
      <Col span={24}>
        <Title level={3}>
          Leaving Soon? Don't Miss Out 100+ Free {category.title} Test Series
        </Title>
        {/* <AppImage alt={category.title} src={category.thumbnailImage} /> */}
        <Text>Also Mock Tests, Free Videos, Quizzes & Study Notes + More</Text>
      </Col>
      <Col span={24}>
        {/* <Form>
          <Form.Item>
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Button type="primary" block>
            // Signup Now! Its Free
          </Button>
        </Form> */}
        <LearnerLogin category={category._id} hideSignup mode="otp" />
      </Col>
      <Col span={24}>
        <Text
          // strong
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar.Group
            size={"small"}
            // max={{
            //   count: 2,
            // }}
          >
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=4" />
          </Avatar.Group>
          <Text strong>Valued by 1 Lakh+ Students</Text>
        </Text>
      </Col>
    </Row>
  );
};
