import Table, { TableColumn } from "@Components/Table/TableComponent";
import { Button, Col, Divider, Dropdown, Form, message, Row, Select, Typography } from "antd"
import { DifficultyLevelTag, QUESTION_DIFFICULTY_LEVELS, TopicTag } from "./AddQuestionFromBank";
import { Constants, Types, User } from "@adewaskar/lms-common";
import TopicSelect from "@Components/TopicSelect";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Link } from "@Router/index";
import Header from "@Components/Header";
import MoreButton from "@Components/MoreButton";
import { SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const TOPIC_PARENT = '65ba1661dcfa321a8595832d'
const languages = ['eng']
interface TestQuestionLibraryPropsI {

}
export const TestQuestionLibrary = (props: TestQuestionLibraryPropsI) => {
    const [form] = Form.useForm();
    const {
        mutate: getQuestionsFromBank,
        isLoading,
        data,
    } = User.Queries.useGetQuestionsFromBank();
    const submit = (data) => {
        getQuestionsFromBank(
            {
                topics: [data.topic],
                difficultyLevel: data.difficultyLevel,
                languages: languages,
            }
            // {
            //     onSuccess: () => {
            //         message.success("Question Selected");
            //         props.closeModal && props.closeModal();
            //     },
            // }
        );
    };
    return <Header title="Test Library">

        <Row>
            <Col span={24}>
                <Form
                    layout="vertical"
                    initialValues={{
                        // difficultyLevel: "",
                        languages: languages,
                    }}
                    onFinish={submit}
                    form={form}
                >
                    <Form.Item>
                        <TopicSelect width="100%" topicId={TOPIC_PARENT} level={4} name="topic" label="Topics" />
                    </Form.Item>
                    <Row justify={"end"}>
                        <Col>
                            <Button onClick={form.submit} loading={isLoading} type="primary">
                                Search Question Bank
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {data?.length ? (
                    <Row>
                        {/* <Col span={24}>
                <QuestionsPerTopicDisplay
                  TOPIC_TREE_DATA={TOPIC_TREE_DATA}
                  selectedTopics={selectedTopics}
                  questionsPerTopic={questionsPerTopic}
                />
              </Col>
              <Divider /> */}
                        <Col span={24}>
                            <Table
                                searchFields={languages.map(
                                    (lang) => `title.text.${lang}`
                                )}
                                rowKey={"_id"}
                                dataSource={data}
                            >
                                <TableColumn
                                    key={"title"}
                                    title="Title"
                                    render={(_: any, record: Types.TestQuestion) => {
                                        const titleText = Object.keys(record.title.text)
                                            .map((t) => record.title.text[t])
                                            .filter((t) => t)[0];
                                        return (
                                            <div style={{ maxWidth: 600 }}>
                                                <Typography.Link
                                                    onClick={() => {
                                                        window.open(
                                                            `/admin/products/test/${record.testId}/builder/${record._id}`
                                                        );
                                                    }}
                                                >
                                                    <HtmlViewer content={titleText} />
                                                </Typography.Link>
                                            </div>
                                        );
                                    }}
                                />
                                {/* <TableColumn
                                        key={"diff-tag"}
                                        title="Title"
                                        render={(_: any, record: Types.TestQuestion) => (
                                            <DifficultyLevelTag
                                                difficultyLevel={record.difficultyLevel}
                                            />
                                        )}
                                    /> */}
                                <TableColumn
                                    key={"topic"}
                                    title="Topic"
                                    render={(_: any, record: Types.TestQuestion) => (
                                        // <div style={{ width: 300 }}>
                                        <TopicSelectColumn record={record} />
                                        // </div>
                                    )}
                                />

                                {/* <TableColumn
                                        key={"language"}
                                        title="Languages"
                                        render={(_: any, record: Types.TestQuestion) =>
                                            Object.keys(record.title.text)
                                                .filter((r) => record.title.text[r])
                                                .map(
                                                    (l) =>
                                                        Constants.LANGUAGES.find((ll) => ll.value === l)
                                                            ?.label
                                                )
                                                .join(", ")
                                        }
                                    /> */}
                                {/* <TableColumn
                                    fixed
                                    title="Action"
                                    key="action"
                                    render={(_: any, test: Types.Test, index: number) => (
                                        <Button danger>Delete</Button>
                                    )}
                                /> */}
                            </Table>
                        </Col>
                    </Row>
                ) : null}
            </Col>
        </Row>
    </Header>

}

export const TopicSelectColumn = (props: { record: Types.TestQuestion }) => {
    const { record } = props;
    const { mutate: updateTestQuestion, isLoading } = User.Queries.useUpdateTestItem()
    const [form] = Form.useForm();
    const onSubmit = (data) => {
        updateTestQuestion({
            itemId: record._id,
            testId: record.testId + '',
            data: {
                topic: data.topic
            }
        }, {
            onSuccess: () => {
                message.success('Topic updated')
            }
        })
    }
    useEffect(() => {
        form.setFieldsValue(record)
    }, [record])
    return <Form form={form} onFinish={onSubmit}>
        <Row>
            <Col> <TopicSelect width={300} name='topic' topicId={TOPIC_PARENT} /></Col>
            <Col>
                <Button loading={isLoading} style={{ marginLeft: 15 }} onClick={form.submit} type='primary' icon={<SaveOutlined />} ></Button></Col>
        </Row>
    </Form>
}