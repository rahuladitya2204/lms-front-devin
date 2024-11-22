import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { Constants, User } from "@adewaskar/lms-common";
import { Button, Col, Divider, Form, Row, Select, Switch } from "antd";
import { useEffect, useState } from "react";

interface RephraseTextComponentPropsI {
  text: string;
  closeModal?: Function;
  onComplete: (text: string) => void;
}

export default function RephraseTextComponent(
  props: RephraseTextComponentPropsI
) {
  const [text, setText] = useState('')
  useEffect(() => {
    setText(props.text)
  }, [props.text])
  const [rephrasedText, setRephrasedText] = useState("");
  const [form] = Form.useForm();
  const { mutate: rephraseText, isLoading: rephrasing } =
    User.Queries.useRephraseText();

  const handleRephraseText = () => {
    form.validateFields().then((values) => {
      rephraseText(
        {
          formatted: values.format,
          rephrase: values.rephrase,
          summarize: values.summarize,
          translateTo: Constants.LANGUAGES.find(
            (i) => i.value === values.translateTo
          )?.label,
          text: text,
        },
        {
          onSuccess: (v) => {
            setRephrasedText(v);
          },
        }
      );
    });
  };

  const handleConfirm = () => {
    props.onComplete(rephrasedText);
    setRephrasedText("");
    form.resetFields();
    props.closeModal && props.closeModal();
  };

  const handleCancel = () => {
    setRephrasedText("");
    form.resetFields();
    props.closeModal && props.closeModal();
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Title level={4}>Old Text</Title>
          <TextArea html={{ level: 3 }} value={text} onChange={setText} />
        </Col>
        <Divider />

        {rephrasedText ? (
          <Col style={{ minWidth: 400, minHeight: 250 }} span={24}>
            <Title level={4}>Rephrased Text</Title>
            <HtmlViewer content={rephrasedText} />
          </Col>
        ) : (
          <>
            <Col span={8}>
              <Form.Item
                name="rephrase"
                label="Rephrase"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="format"
                label="Formatting"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="summarize"
                label="Summarize Content"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="translateTo" label="Translate To">
                <Select options={Constants.LANGUAGES} />
              </Form.Item>
            </Col>
          </>
        )}
        <Divider />
        <Col
          span={24}
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          {rephrasedText ? (
            <Button type="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          ) : (
            <Button
              type="primary"
              loading={rephrasing}
              onClick={handleRephraseText}
            >
              Rephrase Text
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
