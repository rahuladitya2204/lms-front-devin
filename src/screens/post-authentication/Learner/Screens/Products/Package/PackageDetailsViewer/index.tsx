"use client";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Skeleton,
  Tag,
  message,
} from "antd";
import {
  AlertOutlined,
  DollarOutlined,
  MoneyCollectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Store, Types, Utils } from "@adewaskar/lms-common";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@Router/index";

import ActionModal from "@Components/ActionModal/ActionModal";
import Image from "@Components/Image";
import { Learner } from "@adewaskar/lms-common";
import LearnerLogin from "@Learner/Screens/Login";
import PackageDetailsTabs from "./PackageDetailTabs";
import PackageMetadata from "./PackageMetadata";
import PriceCardContent from "@Learner/Screens/StoreScreen/Cards/PriceCardContent";
import ProductCheckoutButton from "@Components/CheckoutButton";
import ProductWalletNudge from "@Components/ProductWalletNudge";
import { Typography } from "@Components/Typography";
import { formatAvgCount } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import image from "./bg.svg";
import styled from "@emotion/styled";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import PackageDetailViewerSkeleton from "./PackageDetailSkeleton";
import { Outlet } from "react-router";
import { FAQsList } from "@Components/CreateFaqsComponent";
import { ProductDetailSignup } from "../../../StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { LogEvent } from "@ServerHooks/useDehydration";

const { Title, Text, Paragraph } = Typography;

const Container = styled.div`
  /* background-image: url(${image.src}); */
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  /* height: 100vh; */
  padding-top: 20px;
`;

const PackageTitle = styled(Title)`
  font-size: 25px;
`;

const PackageSubTitle = styled(Paragraph)`
  font-size: 20px;
`;

interface PackageDetailViewerPropsI {
  isServer?: boolean;
  children?: React.ReactNode;
}

function PackageDetailViewer(props: PackageDetailViewerPropsI) {
  const { id: packageId, type } = useParams();
  const navigate = useNavigate();
  // const loadingPackage = true;
  const { data: bundle, isFetching: loadingPackage } =
    Learner.Queries.useGetPackageDetails(packageId + "", {
      enabled: !!packageId,
    });

  const { data: category } = Learner.Queries.useGetProductCategoryDetails(
    bundle.category,
    // @ts-ignore
    {
      enabled: !!bundle.category,
    }
  );
  useEffect(() => {
    if (!type && !props.isServer) {
      navigate(`/app/test-series/${packageId}/overview`);
    }
  }, [type, category._id, props.isServer]);
  const { openModal } = useModal();
  const RefundBox = bundle?.refund?.enabled ? (
    <Alert
      showIcon
      style={{ marginBottom: 10 }}
      icon={<DollarOutlined />}
      type="info"
      message="100% Refund Policy"
      action={
        <Button
          type="primary"
          onClick={() => {
            openModal(
              <Text>
                This Test series has a 100% refund policy. If you are not
                satisfied, you can get a full refund with{" "}
                {bundle?.refund?.within?.days} days.
              </Text>,
              {
                title: "Refund Policy",
                // content: <RefundPolicy bundle={bundle} />,
                // width: 700,
              }
            );
          }}
          danger
          size="small"
        >
          View Refund Policy
        </Button>
      }
    />
  ) : null;
  const plan =
    (bundle.plan as unknown as Types.Plan) ||
    Constants.INITIAL_COURSE_PLAN_DETAILS;
  // console.log(bundle, "bundle");
  return loadingPackage ? (
    <PackageDetailViewerSkeleton />
  ) : (
    <Container>
      {/* <ProductDetailSignup
        product={{
          type: "category",
          id: bundle.category,
        }}
      /> */}
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={24}>
          <Row gutter={[30, 30]} style={{ lineHeight: 0 }}>
            <Col xs={0} sm={0} md={0} lg={24}>
              {RefundBox}
              <PackageTitle
                style={{ fontSize: 25 }}
                className="course-title"
                level={5}
              >
                {bundle.title}
              </PackageTitle>
              <Col span={24} />
              <PackageSubTitle className="course-title">
                {/* @ts-ignore */}
                {bundle.subtitle}
              </PackageSubTitle>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Row justify="space-between" align="top" gutter={[20, 20]}>
                <Col span={24}>
                  <Row gutter={[30, 30]}>
                    <Col xs={24} lg={0}>
                      {RefundBox}
                      <PackageCard
                        isServer={!!props.isServer}
                        plan={plan}
                        packageId={packageId + ""}
                      />
                    </Col>
                    <Col></Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={[20, 30]}>
                <Col style={{ marginTop: 15 }} span={24}>
                  <Card bodyStyle={{ paddingTop: 25 }}>
                    {props.isServer ? (
                      props.children
                    ) : (
                      // <ProductCategoryTabs id={productCategoryId + ""} />
                      <Outlet />
                    )}
                  </Card>
                </Col>
                {bundle?.faqs?.length ? (
                  <Col span={24}>
                    <Card title="FAQs">
                      <FAQsList faqs={bundle.faqs} />
                    </Card>
                  </Col>
                ) : null}
              </Row>

              {/* </Card> */}
            </Col>
            <Col xs={0} sm={0} md={0} lg={8}>
              <PackageCard
                isServer={!!props.isServer}
                plan={plan}
                packageId={packageId + ""}
              >
                <PackageMetadata package={bundle} />
              </PackageCard>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PackageDetailViewer;

const PackageCard = ({
  packageId,
  plan,
  isServer,
  children,
}: {
  packageId: string;
  isServer: boolean;
  plan: Types.Plan;
  children?: React.ReactNode;
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const { data: bundle, isFetching: loadingPackage } =
    Learner.Queries.useGetPackageDetails(packageId + "", {
      enabled: !!packageId,
    });
  const product = { type: Enum.ProductType.PACKAGE, id: bundle._id };
  const navigate = useNavigate();

  const { mutate: updateCart, isLoading: addingToCart } =
    Learner.Queries.useUpdateCartItems();
  const addItemToCart = (bundle: Types.Package) => {
    updateCart({ data: { product: product }, action: "add" });
  };
  const {
    data: { items },
  } = Learner.Queries.useGetCartDetails();
  const { isSignedIn } = Store.useAuthentication((s) => s);
  const { isDesktop } = useBreakpoint();
  const { data: ep } = Learner.Queries.useGetEnrolledProductDetails({
    type: product.type,
    id: product.id,
  });

  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(product);
  const { openModal } = useModal();
  // const RefundBox = bundle.refund.enabled ? (
  //   <Alert
  //     showIcon
  //     style={{ marginBottom: 10 }}
  //     icon={<DollarOutlined />}
  //     type="info"
  //     message="100% Refund Policy"
  //     action={
  //       <Button
  //         type="primary"
  //         onClick={() => {
  //           openModal(
  //             <Text>
  //               This Test series has a 100% refund policy. If you are not
  //               satisfied, you can get a full refund with{" "}
  //               {bundle?.refund?.within?.days} days.
  //             </Text>,
  //             {
  //               title: "Refund Policy",
  //               // content: <RefundPolicy bundle={bundle} />,
  //               // width: 700,
  //             }
  //           );
  //         }}
  //         danger
  //         size="small"
  //       >
  //         View Refund Policy
  //       </Button>
  //     }
  //   />
  // ) : null;
  const isLoading = loadingPackage;

  const Component = (
    <Card
      cover
      bordered
      hoverable
      style={{ padding: 0 }}
      bodyStyle={{ padding: 5, paddingBottom: 15 }}
      title={
        !isDesktop ? (
          <>
            <Title style={{ fontSize: 20 }} level={5}>
              {bundle.title}
            </Title>
          </>
        ) : null
      }
    >
      <>
        {" "}
        <Row gutter={[20, 10]}>
          <Col span={24}>
            <Image
              alt={bundle.title}
              width={"100%"}
              height={200}
              preview={false}
              src={bundle.thumbnailImage}
            />
          </Col>
          {!isEnrolled ? (
            <Col span={24} style={{ padding: "0 20px" }}>
              <PriceCardContent coupons={bundle.coupons} plan={plan} />
              {!isMobile ? <Divider style={{ margin: 10 }} /> : null}
            </Col>
          ) : null}
          <Col span={24} style={{ padding: "0 20px" }}>
            <Row gutter={[15, 15]}>
              {children ? <Col span={24}>{children}</Col> : null}
              {isSignedIn ? (
                <>
                  <Col span={24}>
                    {isEnrolled ? (
                      <Link
                        title={bundle.title}
                        anchor={isServer}
                        // to={`/app/${packageId}/enrolled-package`}
                        onClick={() =>
                          navigate(
                            `/app/${packageId}/enrolled-package`
                          )
                        }
                      >
                        <Button
                          className="go-to-package-button"
                          onClick={() => {
                            // debugger;
                            navigate(
                              `/app/${packageId}/enrolled-package`
                            )
                          }
                          }
                          size="large"
                          type="primary"
                          block
                          id="go-to-package-button"
                        >
                          Go to Package
                        </Button>
                      </Link>
                    ) : (
                      <ProductCheckoutButton
                        className="enroll-now-button"
                        // onClick={() => {
                        //   LogEvent(
                        //     "Enroll Package Button",
                        //     "Click",
                        //     bundle.title
                        //   );
                        // }}
                        onSuccess={() => {
                          message.open({
                            type: "success",
                            content: `You have enrolled successfully`,
                            // particle: true,
                          });
                          window.open(
                            `/app/${packageId}/enrolled-package`
                          );
                        }}
                        product={{ type: "package", id: packageId + "" }}
                        block
                        type="primary"
                      >
                        Enroll Now
                      </ProductCheckoutButton>
                    )}
                  </Col>{" "}
                </>
              ) : (
                <Col span={24}>
                  <Button className='login-to-access-button'
                    onClick={() => {
                      openModal(<LearnerLogin />, {
                        width: 300,
                      });
                    }}
                    size="large"
                    type="primary"
                    block
                  >
                    Login to access this package
                  </Button>
                  {/* <ActionModal width={300}
                cta={<Button size="large" type="primary" block>
        Login to access this package
            </Button>}>
              <LearnerLogin/>
            </ActionModal> */}
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </>
    </Card>
  );
  // if (bundle.refund.enabled) {
  //   // console.log(bundle, "bubububtuurrrr");
  //   return (
  //     <Badge.Ribbon text="100% Refund Policy" color="red">
  //       {Component}
  //     </Badge.Ribbon>
  //   );
  // }
  return (
    <Row gutter={[10, 0]}>
      {/* {isMobile ? <Col span={24}>{RefundBox}</Col> : null} */}
      <Col span={24}>{Component}</Col>
    </Row>
  );
};

export const RefundAlert = (props: { refund; order }) => {
  const { order, refund } = props;
  if (refund.enabled) {
    switch (order.status) {
      case "refund-requested":
        return (
          <Alert
            showIcon
            style={{ marginBottom: 10 }}
            icon={<DollarOutlined />}
            type="info"
            message="Refund Requested"
          />
        );

      case "refund-initiated":
        return (
          <Alert
            showIcon
            style={{ marginBottom: 10 }}
            icon={<DollarOutlined />}
            type="info"
            message="Refund Initiated"
          />
        );

      case "refund-pending":
        return (
          <Alert
            showIcon
            style={{ marginBottom: 10 }}
            icon={<DollarOutlined />}
            type="warning"
            message="Refund Pending"
          />
        );

      case "refunded":
        return (
          <Alert
            showIcon
            style={{ marginBottom: 10 }}
            icon={<DollarOutlined />}
            type="success"
            message="Refunded"
          />
        );

      case "refund-failed":
        return (
          <Alert
            showIcon
            style={{ marginBottom: 10 }}
            icon={<DollarOutlined />}
            type="error"
            message="Refund Failed"
          />
        );

      default:
        return null; // No alert if the status doesn't match any of the refund-related statuses
    }
  } else {
    return null;
  }
};
