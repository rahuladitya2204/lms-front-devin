"use client";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Skeleton,
  Space,
  Tag,
  message,
} from "antd";

import SkeletonImage from "@Components/SkeletonImage";

import { Typography } from "@Components/Typography";

import useBreakpoint from "@Hooks/useBreakpoint";
const { Text, Paragraph } = Typography;

interface TestDetailSkeletonScreenPropsI { }

export default function TestDetailSkeletonScreen(
  props: TestDetailSkeletonScreenPropsI
) {
  const Metadata = <Skeleton paragraph={{ rows: 8 }} />;

  // const hideLandingPage = test?.landingPage?.description?.length < 200 || false;
  const hideLandingPage = true;
  return (
    <Row gutter={[20, 30]}>
      <Col span={24}>
        <Row
          style={{
            display: "flex",
            justifyContent: hideLandingPage ? "center" : "start",
          }}
          gutter={[30, 30]}
        >
          {!hideLandingPage ? (
            <Col xs={24} sm={24} md={24} lg={16}>
              <Skeleton
                style={{ marginBottom: 30 }}
                active
                paragraph={{ rows: 1 }}
              />
              <Card style={{ paddingTop: 0 }}>
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={24}>
                        {/* <Skeleton active paragraph={{ rows: 1 }} /> */}
                        <SkeletonImage
                          active
                          style={{ flex: 1, height: 400 }}
                        />
                        <Skeleton active paragraph={{ rows: 20 }} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          ) : null}
          <Col xs={0} sm={0} md={0} lg={8}>
            <TestCard>{Metadata}</TestCard>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const TestCard = (props: { children: React.ReactNode }) => {
  const { isMobile, isDesktop, isTablet } = useBreakpoint();

  return (
    <Card
      bodyStyle={{ padding: 10, paddingBottom: 20 }}
      // style={{ height: '100%' }}
      title={
        !isDesktop ? (
          <Skeleton.Button active block style={{ height: 20 }} />
        ) : null
      }
    >
      <>
        <Row gutter={[20, 10]}>
          <Col span={24}>
            <SkeletonImage style={{ flex: 1, height: 200 }} />
          </Col>
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Col>
          <Col span={24}>
            <Skeleton.Button size="large" active block />
          </Col>
        </Row>
      </>
    </Card>
  );
};
