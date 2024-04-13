"use client";
import { Col, Divider, Row } from "@Lib/index";
import { Learner } from "@adewaskar/lms-common";

import BGImage from "./image.png";
import Image from "@Components/Image";
import ProductCategoryCard from "../Cards/ProductCategoryCard";
import { Skeleton } from "@Lib/index";
import SkeletonImage from "@Components/SkeletonImage";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import HomeScreenSkeleton from "./HomeScreenSkeleton";

const { Title, Paragraph } = Typography;

interface LearnerHomeScreenPropsI {
  isServer?: boolean;
}

function LearnerHomeScreen(props: LearnerHomeScreenPropsI) {
  // initialize application utils like interceptors and storage on client side
  const { isFetching } = Learner.Queries.useGetRecommendedProducts();
  const { data: categories } = Learner.Queries.useGetLearnerCategories();
  const { isMobile } = useBreakpoint();
  return (
    <Row gutter={[30, 30]}>
      {isFetching ? (
        <Col span={24}>
          <HomeScreenSkeleton />
        </Col>
      ) : (
        <>
          {!isMobile ? (
            <Col span={24}>
              <Row align={"middle"} gutter={[20, 20]}>
                <Col span={12} flex={1}>
                  <Title>
                    One Destination for
                    <br /> Complete Exam Preparation
                  </Title>
                  <Paragraph style={{ fontSize: 20 }}>
                    🚀 Start your preparation today!
                  </Paragraph>
                  {/* <SearchLearnerCourses /> */}
                </Col>
                <Col span={12}>
                  {/* <Calendar fullscreen={false} /> */}
                  <Image
                    style={{ maxWidth: "32rem" }}
                    preview={false}
                    src={BGImage.src}
                  />
                </Col>
              </Row>
            </Col>
          ) : null}
          <Col span={24}>
            <Title
              style={{ marginBottom: 20, textAlign: "center", fontSize: 28 }}
              level={2}
            >
              Popular Exams
            </Title>
            <Row gutter={[30, 20]}>
              {categories.map((cat, index) => {
                return (
                  <Col sm={12} md={8} xs={24} lg={6} key={index}>
                    <ProductCategoryCard
                      isServer={props.isServer}
                      productCategory={cat}
                    />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </>
      )}
    </Row>
  );
}

export default LearnerHomeScreen;
