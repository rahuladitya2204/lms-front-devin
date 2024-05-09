"use client";
import { Button, Col, Collapse, Form, Input, Modal, Row } from "antd";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { useEffect } from "react";
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
      {/* <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJson),
        }}
      /> */}
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
  {
    return props?.faqs?.map((faq, idx) => {
      const { faqs } = props;
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
      return (
        <>
          <Script
            id="faq-list"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqJson),
            }}
          ></Script>

          <Collapse
            destroyInactivePanel={false}
            expandIconPosition="end"
            style={{ marginTop: 10 }}
            key={idx}
            items={[
              {
                label: faq.title,
                children: (
                  <Typography.Paragraph>{faq.description}</Typography.Paragraph>
                ),
              },
            ]}
          />
        </>
      );
    });
  }
};
