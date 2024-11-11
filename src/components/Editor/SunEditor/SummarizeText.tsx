import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import TextArea from "@Components/Textarea";
import { Title } from "@Components/Typography/Typography";
import { Constants, User } from "@adewaskar/lms-common";
import { Button, Col, Divider, Form, Row, Select, Switch } from "antd";
import { useEffect, useState } from "react";

interface SummarizeTextComponentPropsI {
    closeModal?: Function;
}

export default function SummarizeTextComponent(
    props: SummarizeTextComponentPropsI
) {
    const [text, setText] = useState('')
    const [rephrasedText, setRephrasedText] = useState("");
    const [form] = Form.useForm();
    const { mutate: rephraseText, isLoading: rephrasing } =
        User.Queries.useSummarizeText();

    const handleSummarizeText = () => {
        form.validateFields().then((values) => {
            rephraseText(
                {
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
        // props.onComplete(rephrasedText);
        setRephrasedText("");
        form.resetFields();
        props.closeModal && props.closeModal();
    };

    const handleCancel = () => {
        setRephrasedText("");
        form.resetFields();
        setText('');
        setRephrasedText('')
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
                <Col style={{ minWidth: 400, minHeight: 250 }} span={24}>
                    <Title level={4}>Rephrased Text</Title>
                    <TextArea html={{ level: 3 }} value={rephrasedText} />
                </Col>
                <Divider />
                <Col
                    span={24}
                    style={{ display: "flex", flexDirection: "row-reverse" }}
                >
                    <Button
                        type="primary"
                        loading={rephrasing}
                        onClick={handleSummarizeText}
                    >
                        Rephrase Text
                    </Button>
                    <Button onClick={handleCancel} style={{ marginRight: 10 }} danger>
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}
