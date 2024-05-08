import FAQsComponent from "@Components/FAQsComponent";
import SEOComponent from "@Components/SEOComponent";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { Col, Form, Input, Row } from "antd";

export default function TestSeries() {
  return (
    <>
      <Row>
        <Col span={24}>
          <SEOComponent name={["testSeries", "seo"]} />
        </Col>
        <Col span={24}>
          <FAQsComponent name={["testSeries", "faqs"]} />
        </Col>
        <Col span={24}>
          <Title>Page Content</Title>
          <Form.Item label="URL Slug" name={["testSeries", "slug"]}>
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="Content" name={["testSeries", "content"]}>
            <TextArea html={{ level: 3 }} name={["testSeries", "content"]} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
