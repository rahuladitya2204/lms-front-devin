"use client";
import { Col, Divider, Row, Skeleton } from "antd";

export default function Loading() {
  return (
    <Row gutter={[20, 30]}>
      <Col span={24}>
        <Row gutter={[15, 10]}>
          {[1, 1, 1, 1, 1, 1, 1].map(() => (
            <Col>
              <Skeleton.Button
                block
                style={{ height: 25, width: 120 }}
                active
              />
            </Col>
          ))}
        </Row>
      </Col>
      <Divider style={{ margin: 0 }} />
      <Col span={24}>
        <Skeleton.Button block style={{ height: 400 }} active />
      </Col>
    </Row>
  );
}
