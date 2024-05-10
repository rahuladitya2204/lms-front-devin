import CreateFaqs from "@Components/CreateFaqsComponent";
import SEOComponent from "@Components/SEOComponent";
import Tabs from "@Components/Tabs";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { Col, Form, Input, Row } from "antd";

export default function TestSeries() {
  return (
    <>
      <Tabs
        items={[
          {
            label: "Content",
            key: "content",
            children: (
              <>
                <Form.Item label="Title" name={["testSeries", "page", "title"]}>
                  <Input style={{ width: 300 }} />
                </Form.Item>
                <Form.Item
                  label="URL Slug"
                  name={["testSeries", "page", "slug"]}
                >
                  <Input style={{ width: 300 }} />
                </Form.Item>
                <Form.Item
                  label="Content"
                  name={["testSeries", "page", "content"]}
                >
                  <TextArea
                    html={{ level: 3 }}
                    name={["testSeries", "page", "content"]}
                  />
                </Form.Item>
              </>
            ),
          },
          {
            label: "FAQs",
            key: "faqs",
            children: <CreateFaqs name={["testSeries", "faqs"]} />,
          },
          {
            label: "SEO",
            key: "seo",
            children: <SEOComponent name={["testSeries", "seo"]} />,
          },
        ]}
      />
    </>
  );
}
