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
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  InfoCircleFilled,
  InfoOutlined,
  NotificationOutlined,
  ThunderboltFilled,
  UserOutlined,
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
import { Typography as ANTDTypography, Breadcrumb, Modal } from "antd";
import {
  Link,
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "@Router/index";

import ProductCategoryMetadata from './ProductCategoryMetadata'

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
import { capitalize } from "lodash";
import { isServer } from "@tanstack/react-query";
import { LogEvent } from "@ServerHooks/useDehydration";
import LearnerProductCard from "@Components/LearnerProductCard";
import dynamic from "next/dynamic";
import ProductDetailRow from "./ProductDetailRow";

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
  // const loadingProductCategory = true;
  const { data: productCategory, isLoading: loadingProductCategory } =
    Learner.Queries.useGetProductCategoryDetails(productCategoryId + "", 'basic');
  useEffect(() => {
    if (!type && !props.isServer) {
      navigate(`/app/exam/${productCategoryId}/overview`);
    }
  }, [type]);

  const Metadata = (
    loadingProductCategory ? <Skeleton.Button block active style={{ height: 200 }} /> : <ProductCategoryMetadata productCategory={productCategory} />
  );
  const { isMobile, isDesktop } = useBreakpoint();
  const { data: link, isLoading: loadingCategoryLink } =
    Learner.Queries.useGetProductCategoryLinkDetails(productCategoryId + '', type + '');

  return loadingProductCategory ? (
    <ProductCategoryDetailSkeletonScreen />
  ) : (
    <Row gutter={[20, 10]}>
      <>
        <ProductDetailSignup
          product={{
            type: "category",
            id: productCategoryId,
          }}
        />
        <Col lg={24} md={24} sm={24} xs={24}>
          <Row style={{ marginBottom: 15 }}>
            <Col span={24}>
              <Breadcrumb
                items={[
                  {
                    // href: isServer ? `/home` : `/app/home`,
                    onClick: () => {
                      navigate(props.isServer ? `/` : `/app/store`);
                    },
                    title: <>Home</>,
                  },
                  {
                    onClick: () => {
                      navigate(
                        props.isServer
                          ? `/exam/${productCategoryId}`
                          : `/app/exam/${productCategoryId}`
                      );
                    },
                    title: (
                      <>
                        {/* <UserOutlined /> */}
                        <span>{productCategory.title}</span>
                      </>
                    ),
                  },
                  ...(link
                    ? [
                      {
                        title: (
                          <span>{link?.displayOnLandingPage?.cta?.text}</span>
                        ),
                      },
                    ]
                    : []),
                ]}
              />
            </Col>
          </Row>

          {!loadingProductCategory && productCategory && (
            <ProductDetailRow
              productCategory={productCategory}
              isMobile={isMobile}
              isDesktop={isDesktop}
            />
          )}
          <Row>
            <Col span={24} style={{ marginTop: 20 }}>
              <Card>{Metadata}</Card>
            </Col>
          </Row>
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
  console.log()
  const navigate = useNavigate();
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetails(categoryId);
  return (
    <Row gutter={[20, 20]}>
      {PYQTests.sort((a) => {
        return a.pyq.year
      }).map((test, idx) => {
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
                        ? `/test/${test.slug || test._id
                        }/previous-year-questions`
                        : `/app/test/${test.slug || test._id
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

export const ProductDetailSignup = ({
  product,
  timeout = 20000,
}: {
  product: Types.Product;
  timeout?: number;
}) => {
  const { openModal, hideModal } = useModal(); // Use openModal and hideModal from context
  const [searchParams] = useSearchParams();
  const hidePopup = searchParams.get("hide_popup");
  const { isMobile } = useBreakpoint();
  const categoryId = product.id;

  const { data: category, isLoading: loadingProductCategory } =
    Learner.Queries.useGetProductCategoryDetails(categoryId + "");

  const { data: featuredProducts } = Learner.Queries.useGetFeaturedProducts(
    "package",
    {
      category: product.id,
      limit: 4,
      mode: "one-time",
    }
  );

  const { isSignedIn, isLoading } = Store.useAuthentication((s) => s);

  // State to track if the modal has already been opened
  const [isModalOpened, setIsModalOpened] = useState(false);

  // UseEffect to trigger the modal only once after the timeout
  useEffect(() => {
    if (!isSignedIn && categoryId && !hidePopup && !isModalOpened && !isLoading) {
      const timer = setTimeout(() => {
        openSignupModal(); // Open the signup modal with openModal
        setIsModalOpened(true); // Mark as opened to prevent multiple triggers
        LogEvent(
          capitalize(product.type),
          "Product Signup Modal::Viewed",
          `${category.title}:${capitalize(categoryId)}`,
          {
            categoryId: category._id,
            displayedIn: timeout,
          }
        );
        localStorage.setItem("hide_popup", "true");
      }, timeout);

      // Cleanup the timer to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, categoryId, hidePopup, isLoading, isModalOpened]);

  const openSignupModal = () => {
    openModal(
      <SignupModalContent product={product} featuredProducts={featuredProducts} />,
      { priority: 2 } // Assign priority 2 to the signup modal
    );
  };

  return null; // No direct rendering needed; the modal is handled by the modal context
};


// Modal content as a separate component
const SignupModalContent = ({
  product,
  featuredProducts,
}: {
  product: Types.Product;
  featuredProducts: any[];
}) => {
  const { hideModal } = useModal(); // Get hideModal from context

  return (
    <Row gutter={[10, 20]}>
      <Col span={24}>
        <Title level={3}>
          {featuredProducts.length
            ? `Don't miss out our Bestselling ${product.type} Test Series!`
            : `Leaving Soon? Don't Miss Out 100+ Free Test Series`}
        </Title>
        <Row gutter={[0, 10]}>
          {featuredProducts.map((fp) => (
            <Col span={24} key={fp._id}>
              <LearnerProductCard mini product={fp} />
            </Col>
          ))}
        </Row>
        {!featuredProducts.length ? (
          <Text>Also Mock Tests, Free Videos, Quizzes & Study Notes + More</Text>
        ) : null}
      </Col>
      <Col span={24}>
        <LearnerLogin product={product} hideSignup mode="otp" />
      </Col>
      <Col span={24}>
        <Text style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Avatar.Group size={"small"}>
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