"use client";
import { Card, Col, Row, Skeleton } from "antd";

import { Fragment } from "react";

export default function TestItemSkeleton() {
  const SkelArray = [1, 1, 1, 1];
  return (
    <Card
      title={<Skeleton.Button style={{ height: 25 }} active />}
      style={{ minHeight: "63vh" }}
      extra={[
        <Row gutter={[10, 20]}>
          <Col>
            <Skeleton.Button
              active
              style={{ width: 60, height: 22 }}
              size="small"
            />
          </Col>
          <Col>
            <Skeleton.Button
              active
              style={{ width: 60, height: 22 }}
              size="small"
            />
          </Col>
        </Row>,
      ]}
    >
      {" "}
      <Skeleton style={{ marginBottom: 25 }} active paragraph={{ rows: 1 }} />
      <Row gutter={[10, 20]}>
        <Col span={24}>
          <Skeleton.Button active style={{ height: 20 }} block />
        </Col>
        {SkelArray.map(() => (
          <Col span={24}>
            <Row gutter={[10, 20]}>
              <Col>
                <Skeleton.Avatar active size={20} shape={"circle"} />
              </Col>
              <Col flex={1}>
                <Skeleton.Button active style={{ height: 20 }} block />
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export const TestNavigatorSkeleton = () => {
  const ButtonSkelArray = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  return (
    <Row>
      <Col span={24}>
        <Skeleton.Button
          active
          style={{ height: 20, marginBottom: 20 }}
          block
        />
        <Row gutter={[20, 20]}>
          {ButtonSkelArray.map(() => (
            <Col span={3}>
              <Skeleton.Button
                active
                style={{ width: 32, height: 30 }}
                shape="circle"
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};
