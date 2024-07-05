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
import ActionModal from "@Components/ActionModal/ActionModal";
import GenerateContent from "@User/Screens/Blog/GenerateContent";
import InputTags from "@Components/InputTags/InputTags";

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
                  tabKey="category-links"
                  tabBarStyle={{
                    width: 300,
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
                            tabKey="category-page"
                            tabBarExtraContent={{
                              right: (
                                <Row gutter={[20, 20]}>
                                  <Col>
                                    <ActionModal
                                      title="Generate Content"
                                      cta={
                                        <Button
                                          type="primary"
                                          size="small"
                                          // type="dashed"
                                        >
                                          Generate Content
                                        </Button>
                                      }
                                    >
                                      <GenerateContent
                                        onComplete={(e) => {
                                          form.setFieldValue(
                                            ["info", "links", name],
                                            e
                                          );
                                        }}
                                      />
                                    </ActionModal>
                                  </Col>
                                  <Col>
                                    {" "}
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
                                  </Col>
                                </Row>
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
                                    <Row>
                                      <Col span={4}>
                                        <Form.Item
                                          label="Display On Landing Page"
                                          valuePropName="checked"
                                          {...restField}
                                          name={[
                                            name,
                                            "displayOnLandingPage",
                                            "enabled",
                                          ]}
                                        >
                                          <Switch style={{ marginTop: 20 }} />
                                        </Form.Item>
                                      </Col>
                                      <Col span={8}>
                                        <Form.Item
                                          label="Display Page CTA Text"
                                          // valuePropName="checked"
                                          {...restField}
                                          name={[
                                            name,
                                            "displayOnLandingPage",
                                            "cta",
                                            "text",
                                          ]}
                                        >
                                          <Input
                                            style={{
                                              marginTop: 20,
                                              width: 200,
                                            }}
                                          />
                                        </Form.Item>
                                      </Col>
                                    </Row>

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
                                      name={[name, "keywords"]}
                                      label="Keywords"
                                    >
                                      <InputTags name={[name, `keywords`]} />
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
                                        html={{ level: 3 }}
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
