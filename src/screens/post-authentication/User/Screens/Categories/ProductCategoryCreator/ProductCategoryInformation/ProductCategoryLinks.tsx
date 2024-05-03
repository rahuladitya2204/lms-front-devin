import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Row,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";

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
                  key={key}
                >
                  <Row key={key} gutter={[40, 0]}>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[
                          { required: true, message: "Missing Links title" },
                        ]}
                        label={`Link ${name + 1} Title`}
                      >
                        <Input placeholder="Enter Link title" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "slug"]}
                        rules={[
                          { required: true, message: "Missing Link URL Slug" },
                        ]}
                        label={`Link ${name + 1} URL Slug`}
                      >
                        <Input placeholder="Enter Link URL Slug" />
                      </Form.Item>
                    </Col>
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
                        label={`Link ${name + 1} Title`}
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

                    <Col span={23}>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => remove(name)}
                      >
                        Delete Link
                      </Button>
                    </Col>
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
