import React from "react";
import { Card, Typography, Row, Col } from "antd";
import useBreakpoint from "@Hooks/useBreakpoint";

interface MiniCardPropsI {
  style?: React.CSSProperties;
  accessoryRight?: React.ReactNode;
  //   title: React.ReactNode | string;
  //   subtitle: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  accessoryLeft?: React.ReactNode;
}

export default function MiniCard(props: MiniCardPropsI) {
  //   const { isMobile } = useBreakpoint();
  return (
    <Card
      hoverable
      style={{ marginBottom: 20, ...(props.style || {}) }}
      bodyStyle={{ padding: 15 }}
    >
      <Row gutter={[20, 0]}>
        {props.accessoryLeft ? <Col>{props.accessoryLeft}</Col> : null}
        <Col style={{ flex: 1 }}>{props.children}</Col>
        {/* {props.accessoryRight && <Col>{props.accessoryRight}</Col>} */}
      </Row>
      {props.footer ? (
        <Row style={{ marginTop: 10 }}>
          <Col span={24}>{props.footer}</Col>
        </Row>
      ) : null}
    </Card>
  );
}
