import React from "react";
import { Card, Typography, Row, Col } from "antd";
import useBreakpoint from "@Hooks/useBreakpoint";

interface MiniCardPropsI {
  accessoryRight?: React.ReactNode;
  //   title: React.ReactNode | string;
  //   subtitle: React.ReactNode;
  children?: React.ReactNode;
  accessoryLeft?: React.ReactNode;
}

export default function MiniCard(props: MiniCardPropsI) {
  //   const { isMobile } = useBreakpoint();
  return (
    <Card hoverable style={{ marginBottom: 20 }} bodyStyle={{ padding: 0 }}>
      <Row align="middle">
        {props.accessoryLeft && (
          <Col xs={8} sm={8}>
            {props.accessoryLeft}
          </Col>
        )}
        <Col xs={16} sm={16}>
          {/* {props.subtitle && <div>{props.subtitle}</div>} */}
          <div>{props.children}</div>
        </Col>
        {/* {props.accessoryRight && <Col>{props.accessoryRight}</Col>} */}
      </Row>
    </Card>
  );
}
