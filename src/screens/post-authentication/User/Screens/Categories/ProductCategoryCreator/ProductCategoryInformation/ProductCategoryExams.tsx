import { Button, Col, Form, Input, Row } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";

export default function ProductCategoryEXAMs() {
  return (
    <Row>
      <Col span={24}>
        <Title>EXAMs</Title>
        <Form.List name={["exams"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={[40, 0]}>
                  <Col span={11}>
                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      rules={[
                        { required: true, message: "Missing EXAM title" },
                      ]}
                      label={`EXAM ${name + 1} Title`}
                    >
                      <Input placeholder="Enter EXAM title" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      rules={[
                        { required: true, message: "Missing EXAM description" },
                      ]}
                      label={`EXAM ${name + 1} Description`}
                    >
                      <TextArea placeholder="Enter EXAM description" />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button danger onClick={() => remove(name)}>
                      Remove
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
                  Add EXAM
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Col>
    </Row>
  );
}
