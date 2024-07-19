import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { Constants, User } from "@adewaskar/lms-common";
import { Button, Col, Divider, Form, Row, Select, Switch } from "antd";
import { useState } from "react";

interface RephraseTextComponentPropsI {
  text: string;
  closeModal?: Function;
  onComplete: (text: string) => void;
}

export default function RephraseTextComponent(
  props: RephraseTextComponentPropsI
) {
  const [rephrasedText, setRephrasedText] = useState("");
  const [form] = Form.useForm();
  const { mutate: rephraseText, isLoading: rephrasing } =
    User.Queries.useRephraseText();

  const handleRephraseText = () => {
    form.validateFields().then((values) => {
      rephraseText(
        {
          formatted: values.format,
          translateTo: Constants.LANGUAGES.find(
            (i) => i.value === values.translateTo
          )?.label,
          text: props.text,
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
          <HtmlViewer content={props.text} />
        </Col>
        <Divider />

        {rephrasedText ? (
          <Col style={{ minWidth: 400, minHeight: 250 }} span={24}>
            <Title level={4}>Rephrased Text</Title>
            <HtmlViewer content={rephrasedText} />
          </Col>
        ) : (
          <>
            <Col span={24}>
              <Form.Item
                name="format"
                label="Formatting"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="translateTo" label="Translate To">
                <Select options={Constants.LANGUAGES} />
              </Form.Item>
            </Col>
          </>
        )}

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
