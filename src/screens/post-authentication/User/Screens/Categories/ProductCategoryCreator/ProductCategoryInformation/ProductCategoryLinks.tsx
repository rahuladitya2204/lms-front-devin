import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import FAQsComponent from "@Components/FAQsComponent";
import Tabs from "@Components/Tabs";
import { Fragment } from "react";
import SEOComponent from "@Components/SEOComponent";

const panelStyle: React.CSSProperties = {
  marginBottom: 24,
  //   background: token.colorFillAlter,
  //   borderRadius: token.borderRadiusLG,
  border: "none",
};
export default function ProductCategoryLinks() {
  const form = Form.useFormInstance();
  return (
    <Row>
      <Col span={24}>
        <Title>Links</Title>
        <Form.List name={["info", "links"]}>
          {(fields, { add, remove }) => (
            <Collapse bordered={false}>
              {fields.map(({ key, name, ...restField }) => (
                <Collapse.Panel
                  style={panelStyle}
                  header={
                    form.getFieldValue(["info", "links", key, "title"]) ||
                    `Link-${key + 1}`
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
                  <Row key={key} gutter={[40, 0]}>
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
                            <Fragment>
                              <Col span={24}>
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
                              </Col>
                              <Col span={24}>
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
                              </Col>
                            </Fragment>
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
                                  height={300}
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
                              <FAQsComponent name={[name, "faqs"]} />
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
                </Collapse.Panel>
              ))}
              <Form.Item style={{ marginTop: 20 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Link
                </Button>
              </Form.Item>
            </Collapse>
          )}
        </Form.List>
      </Col>
    </Row>
  );
}
