import CreateFaqs from "@Components/CreateFaqsComponent";
import SEOComponent from "@Components/SEOComponent";
import Tabs from "@Components/Tabs";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row } from "antd";

export default function TestSeries() {
  const form = Form.useFormInstance();
  return (
    <>
      <Row gutter={[40, 0]}>
        <Tabs
          style={{
            width: "100%",
            paddingLeft: 20,
            paddingRight: 20,
          }}
          destroyInactiveTabPane={false}
          items={[
            {
              label: "Page Content",
              key: "content",
              children: (
                <Col span={24}>
                  <Form.Item
                    name={["testSeries", "page", "title"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing Pages title",
                      },
                    ]}
                    label={`Title`}
                  >
                    <Input placeholder="Enter Page title" />
                  </Form.Item>
                  {/* <Form.Item
                    name={["testSeries", "page", "slug"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing Page URL Slug",
                      },
                    ]}
                    label={`URL Slug`}
                  >
                    <Input placeholder="Enter Page URL Slug" />
                  </Form.Item> */}
                  <Form.Item
                    name={["testSeries", "page", "content"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing Page Content",
                      },
                    ]}
                    label={`Page Content`}
                  >
                    <TextArea
                      modifyCta
                      height={700}
                      html={{ level: 2 }}
                      //   @ts-ignore
                      name={["testSeries", "page", "content"]}
                      placeholder="Enter Page content"
                    />
                  </Form.Item>
                </Col>
              ),
            },
            {
              label: "FAQs",
              key: "faqs",
              children: (
                <Form.Item>
                  {/* @ts-ignore */}
                  <CreateFaqs name={["testSeries", "faqs"]} />
                </Form.Item>
              ),
            },
            {
              label: "SEO",
              key: "seo",
              // @ts-ignore
              children: <SEOComponent name={["testSeries", "page", "seo"]} />,
            },
          ]}
        />
      </Row>
    </>
  );
}
