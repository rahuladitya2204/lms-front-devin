import { Button, Col, Form, Input, Modal, Row } from "antd";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";

interface FAQsComponentPropsI {
  name: string | string[];
}

export default function FAQsComponent(props: FAQsComponentPropsI) {
  return (
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
                      rules={[{ required: true, message: "Missing FAQ title" }]}
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
                        { required: true, message: "Missing FAQ description" },
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
  );
}
