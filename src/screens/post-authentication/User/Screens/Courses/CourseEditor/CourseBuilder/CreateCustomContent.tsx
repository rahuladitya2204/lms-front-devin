import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import { useState } from "react";
import { User } from "@adewaskar/lms-common";
import TextArea from "@Components/Textarea";

interface CreateCustomContentComponentPropsI {
  closeModal?: Function;
  onComplete: (content: string) => void;
}

export default function CreateCustomContentComponent(
  props: CreateCustomContentComponentPropsI
) {
  const [generatedContent, setGeneratedContent] = useState("");
  const [form] = Form.useForm();

  const { mutate: createContent, isLoading: generating } =
    User.Queries.useCreateCustomContent();

  const handleCreateContent = () => {
    form.validateFields().then((values) => {
      createContent(
        {
          keywords: [values.keywords + " upsc"],
          instructions: values.instructions,
        },
        {
          onSuccess: (v) => {
            form.setFieldValue(["generatedContent"], v);
          },
        }
      );
    });
  };

  const handleConfirm = () => {
    props.onComplete(generatedContent);
    setGeneratedContent("");
    form.resetFields();
    props.closeModal && props.closeModal();
  };

  const handleCancel = () => {
    setGeneratedContent("");
    form.resetFields();
    props.closeModal && props.closeModal();
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={[10, 10]}>
        {!generatedContent ? (
          <>
            <Col span={24}>
              <Form.Item
                name="keywords"
                label="Keywords"
                rules={[{ required: true, message: "Please enter keywords" }]}
              >
                <Input placeholder="Enter keywords separated by commas" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="instructions"
                label="Instructions"
                rules={[
                  { required: true, message: "Please enter instructions" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter your instructions here"
                />
              </Form.Item>
            </Col>
          </>
        ) : (
          <Col span={24}>
            <Title level={4}>Generated Content</Title>
            <Form.Item name="generatedContent">
              <TextArea name="generatedContent" html={{ level: 3 }} />
            </Form.Item>
          </Col>
        )}
        <Divider />
        <Col
          span={24}
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          {generatedContent ? (
            <Button type="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          ) : (
            <Button
              type="primary"
              loading={generating}
              onClick={handleCreateContent}
            >
              Generate Content
            </Button>
          )}
          <Button onClick={handleCancel} style={{ marginRight: 10 }} danger>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
