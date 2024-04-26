import {
  Button,
  Calendar,
  Carousel,
  Col,
  Divider,
  List,
  Row,
  Space,
} from "@Lib/index";
import { Learner, Store } from "@adewaskar/lms-common";

import BGImage from "./HomeScreen/image.svg";
import CourseCard from "./Cards/CourseCard";
import EventCard from "./Cards/EventCard";
import { Fragment } from "react";
import Image from "@Components/Image";
import { NavLink } from "@Router/index";
import PackageCard from "./Cards/PackageCard";
import Section from "@Components/Section";
import { Skeleton } from "@Lib/index";
import SkeletonImage from "@Components/SkeletonImage";
import TestCard from "./Cards/TestCard";
import { Typography } from "@Components/Typography";
import { capitalize } from "lodash";
import useBreakpoint from "@Hooks/useBreakpoint";

const { Title, Paragraph, Text } = Typography;

function StoreScreen() {
  const { data: products, isFetching } =
    Learner.Queries.useGetRecommendedProducts();
  const { data: categories } = Learner.Queries.useGetLearnerCategories();
  const { isTablet, isMobile } = useBreakpoint();
  const arr = [1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <Row gutter={[30, 30]}>
      {/* <Col span={24}>
        <HomeCarousel />
      </Col> */}
      {!isMobile ? (
        <Col span={24}>
          <Row align={"middle"} gutter={[20, 20]}>
            <Col span={12} flex={1}>
              <Title>
                Find your Preferred <br /> Mock Tests & Improve Your Skills
              </Title>
              <Paragraph style={{ fontSize: 20 }}>
                🚀 Get your competitive edge with our mock tests and ace your
                tests
              </Paragraph>
              {/* <SearchLearnerCourses /> */}
            </Col>
            <Col span={12}>
              {/* <Calendar fullscreen={false} /> */}
              <Image alt="Intro Image" preview={false} src={BGImage.src} />
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
                <Col lg={6} md={8} sm={12} xs={24}>
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
        <>
          <Divider>
            <Title style={{ marginBottom: 0 }} level={isMobile ? 2 : 1}>
              Explore our products
            </Title>
          </Divider>

          {/* <Row gutter={[20,20]}> */}
          {Object.keys(products).map((key) => {
            // @ts-ignore
            const productItems = products[key];
            return productItems.length ? (
              <Col span={24}>
                <Section title={capitalize(key)}>
                  {categories.map((category) => {
                    const categorizedProducts = productItems.filter(
                      // @ts-ignore
                      (prod) => prod.category === category._id
                    );
                    if (!categorizedProducts.length) {
                      return null;
                    }
                    return (
                      <Col span={24} style={{ marginTop: 20 }}>
                        <Section
                          extra={[
                            <NavLink
                              title={"View More"}
                              to={`../exam/${category._id}`}
                            >
                              {" "}
                              <Button
                                style={{ marginLeft: 20, marginBottom: 20 }}
                                type="primary"
                                size="small"
                              >
                                View More
                              </Button>
                            </NavLink>,
                          ]}
                          title={
                            <Space style={{ marginBottom: 15 }}>
                              <Text style={{ fontSize: 18, marginBottom: 0 }}>
                                {category.title}
                              </Text>
                            </Space>
                          }
                        >
                          <Row gutter={[20, 30]}>
                            <Col span={24}>
                              <Row gutter={[30, 20]}>
                                {categorizedProducts.map((product: any) => {
                                  return (
                                    <Col sm={12} md={8} xs={24} lg={6}>
                                      {key === "courses" ? (
                                        <CourseCard course={product} />
                                      ) : null}
                                      {key === "events" ? (
                                        <EventCard event={product} />
                                      ) : null}
                                      {key === "tests" ? (
                                        <TestCard test={product} />
                                      ) : null}
                                      {key === "packages" ? (
                                        <PackageCard package={product} />
                                      ) : null}
                                    </Col>
                                  );
                                })}
                              </Row>
                            </Col>
                          </Row>
                        </Section>
                      </Col>
                    );
                  })}
                </Section>{" "}
              </Col>
            ) : null;
          })}
          {/* </Row> */}
        </>
      )}
    </Row>
  );
}

export default StoreScreen;
