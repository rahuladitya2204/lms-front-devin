"use client";

import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Skeleton,
  Tag,
  message,
} from "@Lib/index";
import { AlertOutlined, UserOutlined } from "@ant-design/icons";
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

const { UnitTypeToStr } = Utils;

const { Title, Text, Paragraph } = Typography;

const ThumbnailSkeleton = styled(Skeleton.Image)`
  .ant-skeleton-image {
    width: 100%;
    height: 20px;
  }
  .ant-skeleton-active {
    display: block !important;
  }
`;

const Container = styled.div`
  /* background-image: url(${image.src}); */
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  /* height: 100vh; */
  padding-top: 20px;
`;

const CustomRate = styled(Rate)`
  .ant-rate-star {
    margin-right: 5px;
  }
`;

const MetaText = styled(Text)``;

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

  useEffect(() => {
    if (!type && !props.isServer) {
      navigate(`/app/test-series/${packageId}/overview`);
    }
  }, [type]);
  const plan =
    (bundle.plan as unknown as Types.Plan) ||
    Constants.INITIAL_COURSE_PLAN_DETAILS;
  // console.log(bundle, "bundle");
  return loadingPackage ? (
    <PackageDetailViewerSkeleton />
  ) : (
    <Container>
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={24}>
          <Row gutter={[30, 30]} style={{ lineHeight: 0 }}>
            <Col xs={0} sm={0} md={0} lg={24}>
              <PackageTitle
                style={{ fontSize: 25 }}
                className="course-title"
                level={1}
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

              <Row>
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
  const product = { type: "package", id: packageId };
  const { data: bundle, isFetching: loadingPackage } =
    Learner.Queries.useGetPackageDetails(packageId + "", {
      enabled: !!packageId,
    });
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
    type: Enum.ProductType.PACKAGE,
    id: "65656a12eff93f74224193e3",
  });

  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(product);
  const { openModal } = useModal();

  const isLoading = loadingPackage;
  return (
    <Card
      cover
      bordered
      hoverable
      style={{ padding: 0 }}
      bodyStyle={{ padding: 5, paddingBottom: 15 }}
      title={
        !isDesktop ? (
          <Title style={{ fontSize: 20 }} level={1}>
            {bundle.title}
          </Title>
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
              <PriceCardContent plan={plan} />
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
                        to={`/app/test-series/${packageId}/enrolled-package`}
                      >
                        <Button
                          // onClick={() =>
                          //   window.open(
                          //     `/app/test-series/${packageId}/enrolled-package`
                          //   )
                          // }
                          size="large"
                          type="primary"
                          block
                        >
                          Go to Package
                        </Button>
                      </Link>
                    ) : (
                      <ProductCheckoutButton
                        onSuccess={() => {
                          message.open({
                            type: "success",
                            content: `You have enrolled successfully`,
                            // particle: true,
                          });
                          // navigate(`enrolled-package`);
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
                  <Button
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
};
