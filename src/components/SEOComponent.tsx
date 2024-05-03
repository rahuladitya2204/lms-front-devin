import { Button, Col, Form, Input, Row } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";

interface SEOComponentPropsI {
  name: string[];
}

export default function SEOComponent(props: SEOComponentPropsI) {
  return (
    <Row>
      <Col span={24}></Col>
      <Title>SEO</Title>
      <Col span={24}>
        <Form.Item
          name={[...props.name, "meta", "title"]}
          rules={[{ required: true, message: "SEO Meta Title" }]}
          label={`SEO Meta Title`}
        >
          <Input placeholder="Please enter SEO meta title" />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name={[...props.name, "meta", "description"]}
          rules={[{ required: true, message: "SEO Meta Description" }]}
          label={`SEO Meta Description`}
        >
          <Input placeholder="Please enter SEO meta description" />
        </Form.Item>
      </Col>
    </Row>
  );
  ā;
}
