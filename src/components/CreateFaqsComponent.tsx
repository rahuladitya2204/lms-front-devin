"use client";
import { Button, Col, Collapse, Form, Input, Modal, Row } from "antd";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { useEffect, useState } from "react";
import Script from "next/script";
import { Types } from "@adewaskar/lms-common";
import { Typography } from "./Typography";

interface CreateFaqsPropsI {
  name: string | string[];
}

export default function CreateFaqs(props: CreateFaqsPropsI) {
  const form = Form.useFormInstance();
  return (
    <>
      <Row>
        <Col span={24}>
          <Title>FAQs</Title>
          <Form.List name={props.name}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[40, 0]}>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[
                          { required: true, message: "Missing FAQ title" },
                        ]}
                        label={`FAQ ${name + 1} Title`}
                      >
                        <Input placeholder="Enter FAQ title" />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        rules={[
                          {
                            required: true,
                            message: "Missing FAQ description",
                          },
                        ]}
                        label={`FAQ ${name + 1} Description`}
                      >
                        <TextArea placeholder="Enter FAQ description" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          Modal.confirm({
                            closable: false,
                            title: `Are you sure?`,
                            // icon: <ExclamationCircleOutlined />,
                            content: `You want to delete this FAQ?`,
                            // footer: [

                            // ],
                            onOk() {
                              remove(name);
                            },
                            okText: "Yes, Delete",
                          });
                        }}
                      >
                        {/* Remove */}
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add FAQ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </>
  );
}

interface FAQsListPropsI {
  faqs: Types.FAQ[];
}

export const FAQsList = (props: FAQsListPropsI) => {
  const { faqs: initialFaqs } = props;
  const [faqs, setFaqs] = useState(initialFaqs);
  useEffect(() => {
    setFaqs(initialFaqs);
  }, [initialFaqs]);
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => {
      return {
        "@type": "Question",
        name: faq.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.description,
        },
      };
    }),
  };

  const handlePanelChange = (key: string | string[]) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq) => {
        if (faq.key === key) {
          return { ...faq, hidden: !faq.hidden };
        }
        return faq;
      })
    );
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJson),
        }}
      />
      <Collapse
        // defaultActiveKey={faqs.map((i) => i.title)}
        destroyInactivePanel={false}
        expandIconPosition="end"
        style={{ marginTop: 10 }}
        onChange={handlePanelChange}
      >
        {faqs.map((faq) => (
          <Collapse.Panel header={faq.title} key={faq.title}>
            <div style={{ display: faq.hidden ? "none" : "block" }}>
              <Typography.Paragraph>{faq.description}</Typography.Paragraph>
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
};

export const RenderFAQJson = (props: { faqs: Types.FAQ[] }) => {
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: props?.faqs?.map((faq) => {
      return {
        "@type": "Question",
        name: faq.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.description,
        },
      };
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqJson),
      }}
    />
  );
};
