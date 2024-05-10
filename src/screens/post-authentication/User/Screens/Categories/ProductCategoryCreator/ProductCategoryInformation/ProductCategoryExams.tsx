import { Button, Col, Collapse, Form, Input, Modal, Row } from "antd";
import * as React from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import Tabs from "@Components/Tabs";
import CreateFaqs from "@Components/CreateFaqsComponent";
import SEOComponent from "@Components/SEOComponent";

const panelStyle: React.CSSProperties = {
  marginBottom: 24,
  //   background: token.colorFillAlter,
  //   borderRadius: token.borderRadiusLG,
  // border: "none",
};

const ProductCategoryEXAMs = React.memo(() => {
  const form = Form.useFormInstance();
  return (
    <Row>
      <Col span={24}>
        <Title>EXAMs</Title>
        <Form.List name={["exams"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Collapse>
                  <Collapse.Panel
                    style={panelStyle}
                    header={
                      form.getFieldValue(["exams", key, "title"]) ||
                      `Exam-${key + 1}`
                    }
                    extra={[
                      <Button
                        icon={<DeleteOutlined />}
                        type="primary"
                        size="small"
                        danger
                        onClick={() => {
                          Modal.confirm({
                            closable: false,
                            title: `Are you sure?`,
                            // icon: <ExclamationCircleOutlined />,
                            content: `You want to delete this link?`,
                            // footer: [

                            // ],
                            onOk() {
                              remove(name);
                            },
                            okText: "Yes, Delete",
                          });
                        }}
                      >
                        Delete Link
                      </Button>,
                    ]}
                    key={key}
                  >
                    <Tabs
                      style={{
                        width: "100%",
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}
                      // tabBarExtraContent={{
                      //   right: (
                      //     <Button
                      //       icon={<DeleteOutlined />}
                      //       type="primary"
                      //       danger
                      //       onClick={() => {
                      //         Modal.confirm({
                      //           closable: false,
                      //           title: `Are you sure?`,
                      //           // icon: <ExclamationCircleOutlined />,
                      //           content: `You want to delete this link?`,
                      //           // footer: [

                      //           // ],
                      //           onOk() {
                      //             remove(name);
                      //           },
                      //           okText: "Yes, Delete",
                      //         });
                      //       }}
                      //     >
                      //       Delete Link
                      //     </Button>
                      //   ),
                      // }}
                      destroyInactiveTabPane={false}
                      items={[
                        {
                          label: "Details",
                          key: "details",
                          children: (
                            <Row key={key} gutter={[40, 0]}>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "title"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing EXAM title",
                                    },
                                  ]}
                                  label={`EXAM ${name + 1} Title`}
                                >
                                  <Input placeholder="Enter EXAM title" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "description"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing EXAM description",
                                    },
                                  ]}
                                  label={`EXAM ${name + 1} Description`}
                                >
                                  <Input placeholder="Enter EXAM description" />
                                </Form.Item>
                              </Col>
                            </Row>
                          ),
                        },
                        {
                          label: "Page",
                          key: "page",
                          children: (
                            <Row key={key} gutter={[40, 0]}>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "page", "title"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing EXAM title",
                                    },
                                  ]}
                                  label={`EXAM ${name + 1} Title`}
                                >
                                  <Input placeholder="Enter EXAM title" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "page", "slug"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing EXAM slug",
                                    },
                                  ]}
                                  label={`EXAM ${name + 1} Slug`}
                                >
                                  <Input placeholder="Enter EXAM slug" />
                                </Form.Item>
                              </Col>
                              {/* <Col span={2}>
                                <Button danger onClick={() => remove(name)}>
                                  Remove
                                </Button>
                              </Col> */}
                            </Row>
                          ),
                        },
                        {
                          label: "Content",
                          key: "content",
                          children: (
                            <Col span={24}>
                              <Form.Item
                                {...restField}
                                name={[name, "description"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing Links description",
                                  },
                                ]}
                                label={`Description`}
                              >
                                <TextArea
                                  modifyCta
                                  height={700}
                                  html={{ level: 2 }}
                                  //   @ts-ignore
                                  name={[name, "description"]}
                                  placeholder="Enter Link description"
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
                              <CreateFaqs name={[name, "faqs"]} />
                            </Form.Item>
                          ),
                        },
                        {
                          label: "SEO",
                          key: "seo",
                          // @ts-ignore
                          children: <SEOComponent name={[name, "seo"]} />,
                        },
                      ]}
                    />
                  </Collapse.Panel>
                </Collapse>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add EXAM
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Col>
    </Row>
  );
});

export default ProductCategoryEXAMs;
