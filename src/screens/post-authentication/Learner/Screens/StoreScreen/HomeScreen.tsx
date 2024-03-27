"use client";
import { Col, Divider, Row } from "antd";
import { Learner } from "@adewaskar/lms-common";

import BGImage from "./image.svg";
import Image from "@Components/Image";
import ProductCategoryCard from "./Cards/ProductCategoryCard";
import { Skeleton } from "antd";
import SkeletonImage from "@Components/SkeletonImage";
import { Typography } from "@Components/Typography";
import useServerBreakpoint from "@ServerHooks/useServerBreakpoint";
import { useDehydrationEffect } from "@ServerHooks/useDehydrationEffect";

const { Title, Paragraph } = Typography;

function LearnerHomeScreen() {
  useDehydrationEffect();
  const { isFetching } = Learner.Queries.useGetRecommendedProducts();
  const { data: categories } = Learner.Queries.useGetLearnerCategories();
  const { isMobile } = useServerBreakpoint();
  const arr = [1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <Row gutter={[30, 30]}>
      {!isMobile ? (
        <Col span={24}>
          <Row align={"middle"} gutter={[20, 20]}>
            <Col span={12} flex={1}>
              <Title>
                One Destination for
                <br /> Complete Exam Preparation
              </Title>
              <Paragraph style={{ fontSize: 20 }}>
                🚀 Start your preparation for selections. For Free!
              </Paragraph>
              {/* <SearchLearnerCourses /> */}
            </Col>
            <Col span={12}>
              {/* <Calendar fullscreen={false} /> */}
              <Image preview={false} src={BGImage.src} />
            </Col>
          </Row>
        </Col>
      ) : null}

      {isFetching ? (
        <Col span={24}>
          <Row gutter={[50, 50]}>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Skeleton.Button
                active
                style={{ width: 320, height: 45, marginTop: 25 }}
              />
            </Col>
            <Skeleton
              style={{ paddingLeft: 25 }}
              paragraph={{ rows: 1 }}
              active
            />
            {arr.map((i) => {
              return (
                <Col lg={6} md={8} sm={12} xs={24} key={i}>
                  <SkeletonImage
                    style={{
                      flex: 1,
                      display: "flex",
                      height: 140,
                      marginBottom: 10,
                    }}
                  />
                  <Skeleton paragraph={{ rows: 1 }} active />
                  <Divider style={{ marginTop: 0, marginBottom: 10 }} />
                  <Row justify={"space-between"}>
                    <Col>
                      <Skeleton.Button
                        active
                        style={{ width: 60, height: 22 }}
                      />
                    </Col>
                    <Col>
                      <Skeleton.Button
                        active
                        style={{ width: 60, height: 22 }}
                      />
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
        </Col>
      ) : (
        <Col span={24}>
          <Title
            style={{ marginBottom: 20, textAlign: "center", fontSize: 28 }}
            level={isMobile ? 2 : 1}
          >
            One Destination for Complete Exam Preparation
          </Title>
          <Row gutter={[30, 20]}>
            {categories.map((cat, index) => {
              return (
                <Col sm={12} md={8} xs={24} lg={6} key={index}>
                  <ProductCategoryCard productCategory={cat} />
                </Col>
              );
            })}
          </Row>
        </Col>
      )}
    </Row>
  );
}

export default LearnerHomeScreen;
