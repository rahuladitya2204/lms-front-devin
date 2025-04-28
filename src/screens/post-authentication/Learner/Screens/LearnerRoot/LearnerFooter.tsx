import { Col, ConfigProvider, Divider, Row, Skeleton, theme } from "antd";
import { Common, Learner } from "@adewaskar/lms-common";

import { Footer } from "@Components/Layout";
import { Fragment, useEffect, useState } from "react";
import {
  FacebookFilled,
  InstagramFilled,
  LinkOutlined,
  LinkedinFilled,
  TwitterSquareFilled,
} from "@ant-design/icons";

const ClientOnly = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <>{children}</>;
};
import OrgLogo from "@Components/OrgLogo";
import { Typography } from "@Components/Typography";
import { Text, Title } from "@Components/Typography/Typography";
import Image from "next/image";
import styled from "styled-components";
import { Link } from "@Router/index";

const CustomText = styled(Text)`
  text-align: left;
  display: block;
`;

interface LearnerFooterPropsI {
  isServer?: boolean;
}
const { darkAlgorithm } = theme;

export default function LearnerFooter(props: LearnerFooterPropsI) {
  const { data: organisation, isLoading: loading } =
    Learner.Queries.useGetOrgDetails();
  const { data: categories } = Learner.Queries.useGetLearnerCategories({ mode: 'basic' });
  const { token } = theme.useToken();
  return (
    <Footer
      style={{
        textAlign: "center",
        // backgroundColor: token.colorBgBase,
        marginTop: 20,
        padding: 15,
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: [darkAlgorithm],
        }}
      ></ConfigProvider>
      <Divider style={{ marginBottom: 0 }}>Testmint.ai</Divider>
      <Row style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Title level={5} style={{ fontSize: 16, textAlign: "left" }}>
            Exams
          </Title>
          <Row>
            {categories.map((cat) => {
              return (
                <Col key={cat.slug} style={{ display: "flex" }} xs={12} sm={6}>
                  <CustomText style={{ textAlign: "left" }}>
                    <Link
                      to={
                        props.isServer
                          ? `/exam/${cat.slug}`
                          : `/app/exam/${cat.slug}`
                      }
                    >
                      {cat.title}
                    </Link>
                  </CustomText>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Divider style={{ marginBottom: 0 }} />
      </Row>
      <Row>
        {/* <Col>
          <LinkOutlined />
          <CustomText
            onClick={() => window.open("/app/policies")}
            style={{ marginLeft: 5, cursor: "pointer" }}
            strong
          >
            View Policies
          </CustomText>
        </Col> */}
        <Col span={24}>
          {loading ? (
            <Fragment>
              <Skeleton.Avatar active style={{ width: 25, height: 25 }} />
              <Skeleton.Button
                active
                style={{ width: 100, height: 20, marginLeft: 20 }}
              />
            </Fragment>
          ) : (
            <Row gutter={[40, 20]}>
              <Col xs={24} sm={8}>
                <Row gutter={[20, 10]}>
                  <Col
                    style={{ display: "flex", alignItems: "center" }}
                    span={24}
                  >
                    <Image
                      alt={organisation.shortName}
                      width={108}
                      height={25}
                      src={organisation.branding.logo.high.url}
                    // width={25}
                    />
                    <CustomText strong style={{ marginLeft: 5 }}>
                      © 2024
                    </CustomText>
                  </Col>
                  {/* <Col span={24}>
                    <CustomText strong>{organisation.name}</CustomText>
                  </Col> */}
                  <Col span={24}>
                    <CustomText style={{ width: 200 }}>
                      Wework, Koramangala, Bangalore, 560030
                    </CustomText>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={8}>
                <CustomText strong>Company</CustomText>
                <Row style={{ marginTop: 15 }} gutter={[10, 5]}>
                  <Col span={24}>
                    <CustomText>
                      <Link>About us</Link>
                    </CustomText>
                  </Col>
                  <Col span={24}>
                    <CustomText>
                      <Link target="_blank" to={`/policies`}>
                        Policies
                      </Link>
                    </CustomText>
                  </Col>
                  <Col span={24}>
                    <CustomText>
                      <Link target="_blank" to={`/sitemap.xml`}>
                        Sitemap
                      </Link>
                    </CustomText>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={8}>
                <Row>
                  <Col span={24}>
                    <CustomText strong>Follow us on</CustomText>
                  </Col>
                  <Col span={24} style={{ marginTop: 15 }}>
                    <ClientOnly>
                      <Row gutter={[10, 10]}>
                        <Col key="facebook">
                          <span className="social-icon">
                            {/* @ts-ignore */}
                            <FacebookFilled />
                          </span>
                        </Col>
                        <Col key="twitter">
                          <span className="social-icon">
                            {/* @ts-ignore */}
                            <TwitterSquareFilled />
                          </span>
                        </Col>
                        <Col key="linkedin">
                          <span className="social-icon">
                            {/* @ts-ignore */}
                            <LinkedinFilled />
                          </span>
                        </Col>
                        <Col key="instagram">
                          <span className="social-icon">
                            {/* @ts-ignore */}
                            <InstagramFilled />
                          </span>
                        </Col>
                      </Row>
                    </ClientOnly>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      <Divider style={{ marginBottom: 10 }} />
      <Row justify={"space-between"}>
        <Col>
          <CustomText strong>
            Copyright © 2024 {organisation.name} Private Limited: All rights reserved
          </CustomText>
        </Col>

        <Col>
          <Link>Privacy Policy</Link>
        </Col>
      </Row>
    </Footer>
  );
}
