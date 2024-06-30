import AppImage from "@Components/Image";
import { Avatar, Col, Row } from "antd";

export default function () {
  return (
    <Row>
      <Col span={24}>
        <Avatar
          style={{ width: 100, height: 100 }}
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
        />{" "}
      </Col>
    </Row>
  );
}
