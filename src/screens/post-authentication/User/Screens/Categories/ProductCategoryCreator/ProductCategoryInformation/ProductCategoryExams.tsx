import { Button, Card, Col, Collapse, Form, Input, Modal, Row } from "antd";
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
        <Card
        //  title="Exams"
        >
          <Form.List name={["exams"]}>
            {(fields, { add, remove }) => (
              <>
                <Tabs
                  tabBarStyle={{
                    height: 700,
                  }}
                  tabBarExtraContent={{
                    right: (
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add EXAM
                      </Button>
                    ),
                  }}
                  tabPosition="left"
                  items={fields.map(({ key, name, ...restField }) => {
                    return {
                      label:
                        form.getFieldValue(["exams", key, "title"]) ||
                        `Exam-${key + 1}`,
                      key: `exam-${name}`,
                      children: (
                        <>
                          <Tabs
                            tabBarExtraContent={{
                              right: (
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
                                </Button>
                              ),
                            }}
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
                                label: "Page Content",
                                key: "content",
                                children: (
                                  <Row>
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
                                    <Col span={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "page", "content"]}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Missing Links description",
                                          },
                                        ]}
                                        label={`Page Content`}
                                      >
                                        <TextArea
                                          modifyCta
                                          height={700}
                                          html={{ level: 2 }}
                                          //   @ts-ignore
                                          name={[name, "page", "content"]}
                                          placeholder="Enter Page Content"
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
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
                        </>
                      ),
                    };
                  })}
                />
              </>
            )}
          </Form.List>
        </Card>
      </Col>
    </Row>
  );
});

export default ProductCategoryEXAMs;
