import React, { useState } from "react";
import { Popover, Button, Row, Col, Form } from "antd";
import TextArea from "@Components/Textarea";

interface HighlightData {
    selectedText: string;
    startXPath: string;
    text: string;
    startOffset: number;
    endXPath: string;
    endOffset: number;
}

interface SelectableContentProps {
    children: React.ReactNode;
    onSaveHighlight?: (data: HighlightData) => void; // Callback to save the highlight
}

const SelectableContent: React.FC<SelectableContentProps> = ({
    children,
    onSaveHighlight,
}) => {
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ left: 0, top: 0 });
    const [selectedText, setSelectedText] = useState("");

    const [form] = Form.useForm();

    const getXPathByIndexes = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
            node = node.parentNode!;
        }

        const parts = [];
        while (node && node.nodeType === Node.ELEMENT_NODE) {
            let index = 1;
            let sibling = node.previousSibling;

            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === node.nodeName) {
                    index++;
                }
                sibling = sibling.previousSibling;
            }

            const tagName = node.nodeName.toLowerCase();
            const nthChild = index > 1 ? `[${index}]` : "";
            parts.unshift(`${tagName}${nthChild}`);
            node = node.parentNode as Node;
        }

        return `/${parts.join("/")}`;
    };

    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selected = selection.toString();

            if (selected.trim()) {
                const rect = range.getBoundingClientRect();

                const popoverWidth = 200;
                const popoverHeight = 60;

                let popoverLeft = rect.left + window.scrollX + rect.width / 2 - popoverWidth / 2;
                let popoverTop = rect.bottom + window.scrollY + 10;

                popoverLeft = Math.max(10, Math.min(popoverLeft, window.innerWidth - popoverWidth - 10));
                popoverTop = Math.max(10, popoverTop);

                const startXPath = getXPathByIndexes(range.startContainer);
                const endXPath = getXPathByIndexes(range.endContainer);

                setPopoverPosition({ left: popoverLeft, top: popoverTop });
                setSelectedText(selected);

                setPopoverVisible(true);
                console.log("Start XPath:", startXPath);
                console.log("End XPath:", endXPath);
            }
        }
    };

    const handleSave = ({ text }: { text: string }) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            const startXPath = getXPathByIndexes(range.startContainer);
            const endXPath = getXPathByIndexes(range.endContainer);
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;
            console.log(selectedText,
                startXPath,
                startOffset,
                endXPath,
                endOffset, '123123123')
            if (onSaveHighlight) {
                onSaveHighlight({
                    selectedText,
                    startXPath,
                    text,
                    startOffset,
                    endXPath,
                    endOffset,
                });
            }
        }

        setPopoverVisible(false);
        form.resetFields();
    };

    const handleCancel = () => {
        setPopoverVisible(false);
        setSelectedText("");
        form.resetFields();
    };

    return (
        <div onMouseUp={handleMouseUp} style={{ position: "relative" }}>
            <Popover
                content={
                    <Form onFinish={handleSave} form={form}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <Form.Item style={{ marginBottom: 0 }} name="text">
                                    <TextArea name="text" />
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <Button
                                    danger
                                    size="small"
                                    type="primary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    style={{ marginLeft: 10 }}
                                    size="small" type="primary" onClick={form.submit}>
                                    Save Highlight
                                </Button>

                            </Col>
                        </Row>
                    </Form>
                }
                visible={popoverVisible}
                placement="bottom"
                overlayStyle={{
                    position: "absolute",
                    left: `${popoverPosition.left}px`,
                    top: `${popoverPosition.top}px`,
                    zIndex: 1050,
                }}
                trigger="click"
            >
                <span />
            </Popover>

            {children}
        </div>
    );
};

export default SelectableContent;
