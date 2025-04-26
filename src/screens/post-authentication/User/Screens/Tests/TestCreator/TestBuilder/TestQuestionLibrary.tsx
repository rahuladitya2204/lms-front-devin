import Table, { TableColumn } from "@Components/Table/TableComponent";
import { Button, Checkbox, Col, Form, message, Row, Skeleton, Typography } from "antd";
import { Types, User } from "@adewaskar/lms-common";
import TopicSelect from "@Components/TopicSelect";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import Header from "@Components/Header";
import { SaveOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { Title } from "@Components/Typography/Typography";
import styled from "@emotion/styled";

const TOPIC_PARENT = '65ba1661dcfa321a8595832d';
const languages = ['eng'];

const FormItem = styled(Form.Item)`
.ant-form-item {
    margin: 0;
}
`

interface TestQuestionLibraryPropsI { }

export const TestQuestionLibrary = (props: TestQuestionLibraryPropsI) => {
    const [form] = Form.useForm();
    const [savingId, setSavingId] = useState<string | null>(null); // NEW: Track which row is saving

    const { mutate: getQuestionsFromBank, isLoading, data = [] } = User.Queries.useGetQuestionsFromBank();
    const { mutate: getQuestionsFromBankForCount, data: dataCount = [], isLoading: dataCountLoading
    } = User.Queries.useGetQuestionsFromBank();
    const { mutate: updateTestQuestion } = User.Queries.useUpdateTestItem();
    const updateSearchCount = () => {
        getQuestionsFromBankForCount({
            topics: [formData.topic],
            difficultyLevel: formData.difficultyLevel,
            languages,
        });
    }
    const submit = (formData: any) => {
        const data = {
            topics: [formData.topic],
            difficultyLevel: formData.difficultyLevel,
            languages,
        }
        getQuestionsFromBank(data);
        getQuestionsFromBankForCount(data)
    };
    const formData = form.getFieldsValue();

    useEffect(() => {
        getQuestionsFromBankForCount({
            topics: [formData.topic],
            difficultyLevel: formData.difficultyLevel,
            languages,
        });
    }, [formData.topic, formData.difficultyLevel])

    const handleTopicSave = async (record: Types.TestQuestion) => {
        if (!record.topic) return;

        setSavingId(record._id); // set loading for only the clicked row

        updateTestQuestion(
            {
                itemId: record._id,
                testId: record.testId,
                data: {
                    topic: record.topic,
                    aiTraining: record.aiTraining,
                },
            },
            {
                onSuccess: () => {
                    message.success("Question Updated Successfully");
                    setSavingId(null); // reset after save
                    updateSearchCount();
                },
                onError: () => {
                    setSavingId(null); // reset even if error
                },
            }
        );
    };

    const aiQuestionCount = useMemo(() => {
        return data.filter((d) => d.aiTraining?.enabled).length;
    }, [data]);

    return (
        <Header title="Question Library">
            <Row>
                <Col span={24}>
                    <Form layout="vertical" onFinish={submit} form={form}>

                        <Row align={'middle'} gutter={15}>
                            <Col>
                                <FormItem style={{ margin: 0 }} name="topic">
                                    <TopicSelect width="500px" topicId={TOPIC_PARENT} level={4} />
                                </FormItem></Col>
                            <Col>
                                <Button htmlType="submit" loading={isLoading} type="primary">
                                    Search Question Bank
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    {data.length ? (
                        <Row style={{ marginTop: 24 }}>
                            <Col span={24}>
                                <Title level={4}>
                                    <Row align='middle'>
                                        <Col>
                                            <span style={{ fontSize: 20 }}>AI Training Question:</span>
                                        </Col>
                                        <Col>
                                            <span style={{ fontSize: 20 }}>
                                                {' '}{dataCountLoading ? <Skeleton.Button active block style={{ height: 20, width: 20 }} /> : dataCount.filter(i => i?.aiTraining?.enabled).length}
                                            </span>
                                        </Col></Row>
                                </Title>
                            </Col>
                            <Col span={24}>
                                <Table
                                    searchFields={languages.map((lang) => `title.text.${lang}`)}
                                    rowKey="_id"
                                    dataSource={data.sort(i => i.aiTraining?.enabled ? -1 : 1)}
                                >
                                    <TableColumn
                                        key="checkbox"
                                        title="Include in AI Training"
                                        render={(_: any, record: Types.TestQuestion) => (
                                            <Checkbox
                                                defaultChecked={record.aiTraining?.enabled}
                                                onChange={(e) => {
                                                    record.aiTraining = { enabled: e.target.checked };
                                                }}
                                            />
                                        )}
                                    />

                                    <TableColumn
                                        key="title"
                                        title="Title"
                                        render={(_: any, record: Types.TestQuestion) => {
                                            const titleText = Object.keys(record.title.text)
                                                .map((t) => record.title.text[t])
                                                .filter((t) => t)[0];
                                            return (
                                                <Typography.Link
                                                    onClick={() => {
                                                        window.open(`/admin/products/test/${record.testId}/builder/${record._id}`);
                                                    }}
                                                >
                                                    <HtmlViewer content={titleText} />
                                                </Typography.Link>
                                            );
                                        }}
                                    />

                                    <TableColumn
                                        key="topic"
                                        title="Topic"
                                        render={(_: any, record: Types.TestQuestion) => (
                                            <Row align="middle">
                                                <Col>
                                                    <TopicSelect
                                                        width={300}
                                                        notDisabled
                                                        topicId={TOPIC_PARENT}
                                                        defaultValue={record.topic}
                                                        onChange={(value) => {
                                                            record.topic = value;
                                                        }}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Button
                                                        type="primary"
                                                        icon={<SaveOutlined />}
                                                        loading={savingId === record._id}
                                                        onClick={() => handleTopicSave(record)}
                                                    />
                                                </Col>
                                            </Row>
                                        )}
                                    />
                                </Table>
                            </Col>
                        </Row>
                    ) : null}
                </Col>
            </Row>
        </Header>
    );
};
