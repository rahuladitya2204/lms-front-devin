import React from "react";
import { Card, Typography, Row, Col } from "antd";
import useBreakpoint from "@Hooks/useBreakpoint";

interface MiniCardPropsI {
  accessoryRight?: React.ReactNode;
  title: React.ReactNode | string;
  subtitle: React.ReactNode;
  children?: React.ReactNode;
  accessoryLeft?: React.ReactNode;
}

export default function MiniCard(props: MiniCardPropsI) {
  const { isMobile } = useBreakpoint();
  return (
    <Card hoverable style={{ marginBottom: 20 }} bodyStyle={{ padding: 0 }}>
      <Row align="middle">
        {props.accessoryLeft && <Col span={7}>{props.accessoryLeft}</Col>}
        <Col span={17}>
          {/* {props.subtitle && <div>{props.subtitle}</div>} */}
          <div style={{ paddingLeft: isMobile ? 20 : 10 }}>
            {props.children}
          </div>
        </Col>
        {/* {props.accessoryRight && <Col>{props.accessoryRight}</Col>} */}
      </Row>
    </Card>
  );
}
