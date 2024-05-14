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
      <Form.List name={["testSeries"]}>
        {(fields, { add, remove }) => (
          <>
            <Tabs
              tabBarStyle={{
                width: 200,
                height: 700,
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
                    Add Page
                  </Button>
                ),
              }}
              items={fields.map(({ key, name, ...restField }) => {
                return {
                  label:
                    form.getFieldValue(["testSeries", name, "page", "slug"]) ||
                    `Page-${key + 1}`,
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
                              Delete Page
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
                        //       Delete Page
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
                                  {...restField}
                                  name={[name, "page", "title"]}
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
                                <Form.Item
                                  {...restField}
                                  name={[name, "page", "slug"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Page URL Slug",
                                    },
                                  ]}
                                  label={`URL Slug`}
                                >
                                  <Input placeholder="Enter Page URL Slug" />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "page", "content"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Pages description",
                                    },
                                  ]}
                                  label={`Description`}
                                >
                                  <TextArea
                                    modifyCta
                                    height={700}
                                    html={{ level: 2 }}
                                    //   @ts-ignore
                                    name={[name, "page", "content"]}
                                    placeholder="Enter Page description"
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
    </>
  );
}
