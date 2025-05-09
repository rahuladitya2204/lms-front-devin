"use client";
import { Avatar, Card, Col, Divider, List, Row, Space } from "antd";
import { Learner } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import ProductCategoryCard from "../Cards/ProductCategoryCard";
import { Skeleton } from "antd";
import SkeletonImage from "@Components/SkeletonImage";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import HomeScreenSkeleton from "./HomeScreenSkeleton";
import Hero2 from "./hero2.svg";
import OrgLogo from "@Components/OrgLogo";
import { Text } from "@Components/Typography/Typography";
import {
  BarChartOutlined,
  CaretRightOutlined,
  EditOutlined,
  HighlightOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { features } from "./constant";
import { useModal } from "@Components/ActionModal/ModalContext";
import MiniCard from "../Cards/MiniCard";
import { Link } from "@Router/index";
import HomeCarousel from "../StoreCarousel";
import { useText } from "@Components/Editor/SunEditor/utils";
import SearchUserProducts from "@Components/SearchUserProducts";
const { Title, Paragraph } = Typography;

interface LearnerHomeScreenPropsI {
  isServer?: boolean;
}

function LearnerHomeScreen(props: LearnerHomeScreenPropsI) {
  const { isFetching } = Learner.Queries.useGetRecommendedProducts();
  const { data: categories } = Learner.Queries.useGetLearnerCategories({ mode: 'basic' });
  const { isMobile, isDesktop } = useBreakpoint();
  const { FormatLangText, FormatNumber } = useText('eng');
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
              {/* <Image src={BgImg.src} /> */}
              <Row align={"middle"} gutter={[20, 20]}>
                <Col span={12} flex={1}>
                  <Title>
                    One Destination for
                    <br /> Complete Exam Preparation
                  </Title>
                  <Paragraph style={{ fontSize: 20 }}>
                    🚀 Start your preparation today!
                  </Paragraph>
                  {/* <SearchUserProducts placeholder='Search for your exam, test series' width="100%" /> */}
                </Col>
                <Col span={12}>
                  <div>
                    <Image
                      priority
                      style={{ maxWidth: "32rem" }}
                      preview={false}
                      src={'/images/hero.png'}
                    />
                  </div>
                </Col>
              </Row>
              <Divider style={{ marginBottom: 0 }} />
            </Col>
          ) : null}
          {/* <Col xs={24} sm={24} md={24}>
            <Title style={{ marginBottom: 20, fontSize: 28 }} level={2}>
              Our Best In-Class Test Series
            </Title>
            <Card>
              <Row>
                <Col span={24}>
                  <HomeCarousel />
                </Col>
              </Row>
            </Card>

          </Col> */}
          <Col span={24}>
            <SearchUserProducts placeholder='Search for your exam, test series' width="100%" />
            <Title style={{ marginBottom: 20, fontSize: 28 }} level={2}>
              {FormatLangText('POPULAR_EXAMS')}
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
          <Divider />
          <Col span={24}>
            <Row gutter={[40, 20]} align={"middle"}>
              <Col xs={24} sm={24} md={24}>
                <Title
                  style={{ margin: 0, textAlign: isMobile ? "center" : "left" }}
                  level={4}
                >
                  Enroll for Testmint.ai Test Series today!
                </Title>
                <div
                  // level={4}
                  style={{
                    fontSize: 15,
                    marginBottom: 20,
                    marginTop: 10,
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  <Text>What you get with Testmint.ai's platform</Text>
                </div>
                <Row gutter={[20, 10]}>
                  {features.map((feature) => {
                    return (
                      <Col xs={24} sm={12}>
                        <Link to={`/blog/${feature.blog}`}>
                          <MiniCard
                            style={{
                              cursor: "pointer",
                              // height: isMobile ? 120 : "auto",
                            }}
                            accessoryRight={() => <CaretRightOutlined />}
                          >
                            <Row
                              justify={"center"}
                              gutter={[20, 10]}
                              align={"middle"}
                            >
                              <Col
                                style={{ textAlign: "center" }}
                                xs={24}
                                lg={5}
                              >
                                <Avatar
                                  style={{
                                    backgroundColor: feature.color,
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "auto",
                                  }}
                                  icon={feature.icon}
                                />
                              </Col>
                              <Col xs={24} style={{}} lg={19}>
                                <Title
                                  style={{
                                    margin: 0,
                                    fontSize: 17,
                                    textAlign: `center`,
                                  }}
                                  level={4}
                                >
                                  {feature.title}
                                </Title>
                              </Col>
                            </Row>
                          </MiniCard>
                        </Link>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
            <Divider />
          </Col>
        </>
      )}
    </Row>
  );
}

export default LearnerHomeScreen;

export const FeaturePageDetail = (props: {
  feature: {
    title: string;
    icon: React.ReactNode;
    color: string;
    page: {
      content: string;
      title: string;
      list: {
        items: string[];
      };
    };
  };
}) => {
  const { feature } = props;
  return (
    <Row>
      <Col span={24}>
        {/* <Title level={3}>{feature.page.title}</Title> */}
        <List
          dataSource={feature?.page?.list?.items}
          renderItem={(r) => <List.Item>{r}</List.Item>}
        />
      </Col>
    </Row>
  );
};
