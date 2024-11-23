import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { Constants, User } from "@adewaskar/lms-common";
import { Button, Col, Divider, Form, Row, Select, Switch } from "antd";
import { useEffect, useState } from "react";

interface ModifyTextComponentPropsI {
  text: string;
  closeModal?: Function;
  onComplete: (text: string) => void;
}

export default function ModifyTextComponent(
  props: ModifyTextComponentPropsI
) {
  const [text, setText] = useState('')
  useEffect(() => {
    setText(props.text)
  }, [props.text])
  const [rephrasedText, setModifiedText] = useState("");
  const [form] = Form.useForm();
  const { mutate: rephraseText, isLoading: rephrasing } =
    User.Queries.useRephraseText();

  const handleModifyText = () => {
    form.validateFields().then((values) => {
      rephraseText(
        {
          formatted: values.format,
          rephrase: values.rephrase,
          summarize: values.summarize,
          instructions: values.instructions,
          translateTo: Constants.LANGUAGES.find(
            (i) => i.value === values.translateTo
          )?.label,
          text: text,
        },
        {
          onSuccess: (v) => {
            setModifiedText(v);
          },
        }
      );
    });
  };

  const handleConfirm = () => {
    props.onComplete(rephrasedText);
    setModifiedText("");
    form.resetFields();
    props.closeModal && props.closeModal();
  };

  const handleCancel = () => {
    setModifiedText("");
    form.resetFields();
    props.closeModal && props.closeModal();
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={[10, 10]}>
        <Col span={4}>
          <Form.Item
            name="rephrase"
            label="Rephrase"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="summarize"
            label="Summarize"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="format"
            label="Formatting"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        {/* <Col span={4}>
          <Form.Item
            name="summarize"
            label="Summarize Content"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col> */}
        <Col span={6}>
          <Form.Item name="translateTo" label="Translate To">
            <Select options={Constants.LANGUAGES} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="instructions"
            label="Custom Instructions"
          >
            <TextArea name="instructions" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Row justify={'end'}>
            <Col>
              <Button
                type="primary"
                loading={rephrasing}
                onClick={handleModifyText}
              >
                Modify Text
              </Button>
            </Col></Row>
        </Col>
        <Col span={12}>
          <Title level={4}>Old Text</Title>
          <TextArea html={{ level: 3 }} value={text} onChange={setText} />
        </Col>
        {rephrasedText ? (
          <Col style={{ minWidth: 400, minHeight: 250 }} span={12}>
            <Title level={4}>Modified Text</Title>
            <TextArea onChange={setModifiedText} html={{ level: 3 }} value={rephrasedText} />
          </Col>
        ) : (
          null
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
            null
          )}
          <Button onClick={handleCancel} style={{ marginRight: 10 }} danger>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
