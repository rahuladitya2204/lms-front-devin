import FAQsComponent from "@Components/FAQsComponent";
import SEOComponent from "@Components/SEOComponent";
import { Col, Row } from "antd";

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
      </Row>
    </>
  );
}
