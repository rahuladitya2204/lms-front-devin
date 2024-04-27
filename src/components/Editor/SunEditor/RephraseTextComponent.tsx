import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { User } from "@adewaskar/lms-common";
import { Button, Col, Form, Row, Switch } from "antd";
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
  const [format, setFormat] = useState(false);
  const { mutate: rephraseText, isLoading: rephrasing } =
    User.Queries.useRephraseText();
  return (
    <Row gutter={[10, 10]}>
      {/* <Col span={24}>Rephrased Text</Col> */}
      <Col span={24}>
        <Title level={4}>Old Text</Title>
        <HtmlViewer content={props.text} />
      </Col>
      {rephrasedText ? (
        <Col style={{ minWidth: 400, minHeight: 250 }} span={24}>
          <Title level={4}>Rephrased Text</Title>
          <HtmlViewer content={rephrasedText} />
        </Col>
      ) : (
        <Col span={24}>
          <Form.Item label="Formatting">
            <Switch checked={format} onChange={setFormat} />
          </Form.Item>
        </Col>
      )}

      <Col span={24} style={{ display: "flex", flexDirection: "row-reverse" }}>
        {rephrasedText ? (
          <Button
            type="primary"
            onClick={() => {
              props.onComplete(rephrasedText);
              setRephrasedText("");
              setFormat(false);

              props.closeModal && props.closeModal();
            }}
          >
            Confirm
          </Button>
        ) : (
          <Button
            type="primary"
            loading={rephrasing}
            onClick={() => {
              rephraseText(
                {
                  // @ts-ignore
                  formatted: format,
                  text: props.text,
                },
                {
                  onSuccess: (v) => {
                    console.log(v, "vv");
                    setRephrasedText(v);
                  },
                }
              );
            }}
          >
            Rephrase Text
          </Button>
        )}
        <Button
          onClick={() => {
            setRephrasedText("");
            setFormat(false);
            props.closeModal && props.closeModal();
          }}
          style={{ marginRight: 10 }}
          danger
        >
          Cancel
        </Button>
      </Col>
    </Row>
  );
}
