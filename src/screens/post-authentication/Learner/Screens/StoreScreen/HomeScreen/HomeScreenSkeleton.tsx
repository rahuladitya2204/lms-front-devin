"use client";
import SkeletonImage from "@Components/SkeletonImage";
import { Col, Divider, Row, Skeleton } from "@Lib/index";

const HomeScreenSkeleton = () => {
  const arr = [1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <Row gutter={[50, 50]}>
      <Col span={24}>
        <Skeleton.Button active block style={{ height: 300 }} />
      </Col>
      <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
        <Skeleton.Button
          active
          style={{ width: 320, height: 45, marginTop: 25 }}
        />
      </Col>
      {/* <Skeleton style={{ paddingLeft: 25 }} paragraph={{ rows: 1 }} active /> */}
      {arr.map((i) => {
        return (
          <Col lg={6} md={8} sm={12} xs={24} key={i}>
            <Skeleton.Button
              active
              style={{
                flex: 1,
                display: "flex",
                height: 70,
                marginBottom: 10,
              }}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default HomeScreenSkeleton;
