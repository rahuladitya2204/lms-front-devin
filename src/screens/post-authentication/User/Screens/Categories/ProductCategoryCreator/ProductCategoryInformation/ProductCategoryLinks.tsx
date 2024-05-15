import React from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Switch,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import CreateFaqs from "@Components/CreateFaqsComponent";
import Tabs from "@Components/Tabs";
import { Fragment } from "react";
import SEOComponent from "@Components/SEOComponent";

const panelStyle: React.CSSProperties = {
  marginBottom: 24,
  //   background: token.colorFillAlter,
  //   borderRadius: token.borderRadiusLG,
  // border: "none",
};
const ProductCategoryLinks = React.memo(() => {
  const form = Form.useFormInstance();
  return (
    <Row>
      <Col span={24}>
        <Card
        //  title="Links"
        >
          <Form.List name={["info", "links"]}>
            {(fields, { add, remove }) => (
              <>
                <Tabs
                  tabBarStyle={{
                    width: 151,
                    // height: 700,
                  }}
                  tabPosition="left"
                  tabBarExtraContent={{
                    right: (
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Link
                      </Button>
                    ),
                  }}
                  items={fields.map(({ key, name, ...restField }) => {
                    return {
                      label:
                        form.getFieldValue(["info", "links", key, "title"]) ||
                        `Link-${key + 1}`,
                      key: `link-${name}`,
                      children: (
                        <Row key={key} gutter={[40, 0]}>
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
                                label: "Page Content",
                                key: "content",
                                children: (
                                  <Col span={24}>
                                    <Form.Item
                                      label="Display On Landing Page"
                                      valuePropName="checked"
                                      {...restField}
                                      name={[name, "displayOnLandingPage"]}
                                    >
                                      <Switch style={{ marginTop: 20 }} />
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "title"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing Links title",
                                        },
                                      ]}
                                      label={`Title`}
                                    >
                                      <Input placeholder="Enter Link title" />
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "slug"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing Link URL Slug",
                                        },
                                      ]}
                                      label={`URL Slug`}
                                    >
                                      <Input placeholder="Enter Link URL Slug" />
                                    </Form.Item>
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
                        </Row>
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

export default ProductCategoryLinks;
