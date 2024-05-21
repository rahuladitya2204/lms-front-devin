import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import InputTags from "@Components/InputTags/InputTags";
import TextArea from "@Components/Textarea";
import { Constants, Learner, Types, User } from "@adewaskar/lms-common";
import { Button, Col, Form, Row } from "antd";
import { useState } from "react";

interface GenerateContentPropsI {
  onComplete: (d: string) => Partial<Types.Blog>;
  closeModal?: Function;
}

export default function GenerateContent(props: GenerateContentPropsI) {
  const [form] = Form.useForm();
  const [content, setContent] = useState(Constants.INITIAL_BLOG_DETAILS);
  const { mutate: generateBlog, isLoading } = User.Queries.useGenerateBlog();
  const submit = (d: { text: string; keywords: string[] }) => {
    console.log(d, "ddd");
    generateBlog(d, {
      onSuccess: (data) => {
        console.log(data, "ddd");
        // props.onComplete(data);
        setContent(data);
      },
    });
  };
  const cancel = () => {
    setContent(Constants.INITIAL_BLOG_DETAILS);
    form.resetFields();
    props.closeModal && props.closeModal();
  };
  return (
    <Row>
      <Col span={24}>
        <Form onFinish={submit} form={form} layout="vertical">
          <Form.Item label="Instruction" name="text">
            <TextArea />
          </Form.Item>

          <Form.Item label="SEO keywords" name="keywords">
            <InputTags name="keywords" />
          </Form.Item>

          <Form.Item>
            <HtmlViewer content={content.content} />
          </Form.Item>

          <Row justify="end">
            <Col>
              <Button
                style={{ marginRight: 10 }}
                danger
                onClick={() => cancel()}
              >
                Cancel
              </Button>
              {content.content ? (
                <Button
                  onClick={() => {
                    props.onComplete({
                      seo: content.seo,
                      slug: content.slug,
                      description: content.content,
                    });
                    cancel();
                    props.closeModal && props.closeModal();
                  }}
                  type="primary"
                >
                  Confirm
                </Button>
              ) : (
                <Button htmlType="submit" type="primary" loading={isLoading}>
                  Generate Blog
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
