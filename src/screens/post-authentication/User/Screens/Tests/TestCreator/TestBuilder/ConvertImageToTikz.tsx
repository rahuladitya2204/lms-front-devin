import { Button, Col, Form, Input, Row, Image, Typography, Spin } from "antd";
import { useState } from "react";

const { Text } = Typography;

interface ConvertImageToTikzProps {
  closeModal?: Function;
}

interface ImageToTikzForm {
  imageUrl: string;
}

export default function ConvertImageToTikz({
  closeModal,
}: ConvertImageToTikzProps) {
  const [form] = Form.useForm<ImageToTikzForm>();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tikzPreview, setTikzPreview] = useState<string | null>(null);

  const onSubmit = async (values: ImageToTikzForm) => {
    try {
      setLoading(true);
      setImagePreview(values.imageUrl);
      // TODO: Implement API call to convert image to TikZ
      // For now, setting a placeholder
      setTikzPreview('Sample TikZ preview');
    } catch (error) {
      console.error('Error converting image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Form.Item
        label="Image URL"
        name="imageUrl"
        rules={[{ required: true, message: "Please enter an image URL" }]}
      >
        <Input placeholder="Enter image URL" />
      </Form.Item>

      <Button 
        type="primary" 
        onClick={form.submit}
        loading={loading}
        style={{ marginBottom: 24 }}
      >
        Convert Image
      </Button>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Text strong>Original Image Preview</Text>
          <div style={{ marginTop: 16, minHeight: 300, background: '#f5f5f5', padding: 16 }}>
            {loading ? (
              <Spin />
            ) : imagePreview ? (
              <Image
                src={imagePreview}
                alt="Original"
                style={{ maxWidth: '100%' }}
              />
            ) : (
              <Text type="secondary">No image to preview</Text>
            )}
          </div>
        </Col>
        <Col span={12}>
          <Text strong>TikZ Code Preview</Text>
          <div style={{ marginTop: 16, minHeight: 300, background: '#f5f5f5', padding: 16 }}>
            {loading ? (
              <Spin />
            ) : tikzPreview ? (
              <div>
                <Text>{tikzPreview}</Text>
                {/* TODO: Add actual TikZ preview rendering */}
              </div>
            ) : (
              <Text type="secondary">No TikZ code generated yet</Text>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
}