import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Tag,
  TreeSelect,
  message,
} from "@Lib/index";
import { Constants, Enum, Types, User, Utils } from "@adewaskar/lms-common";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { htmlToText } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useBuildTopicTree } from "../TestInformation/TestDetailsEditor/TestDetails";
import TopicSelect from "@Components/TopicSelect";
import { Title } from "@Components/Typography/Typography";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";

export const QUESTION_TYPES = [
  { value: Enum.TestQuestionType.SINGLE, label: "Single Choice" },
  { value: Enum.TestQuestionType.MULTIPLE, label: "Multiple Choice" },
  { value: Enum.TestQuestionType.NUMERIC, label: "Numeric" },
  { value: Enum.TestQuestionType.SUBJECTIVE, label: "Subjective" },
  {
    value: Enum.TestQuestionType.FILL_IN_THE_BLANK,
    label: "Fill in the blank",
  },
];

export const QUESTION_DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "difficult", label: "Difficult" },
];
export const AddQuestionFromBank = (props: {
  onSelect?: (t: Types.TestQuestion) => void;
  closeModal?: Function;
  topics: string[];
  items: Types.TestQuestion[];
  itemCount: number;
  multiple?: boolean;
  languages: string[];
}) => {
  const { data: TOPIC_TREE_DATA } = useBuildTopicTree(props.topics, 4);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const {
    mutate: getQuestionsFromBank,
    isLoading,
    data,
  } = User.Queries.useGetQuestionsFromBank();

  const submit = (data) => {
    const nodeId = data.topics.map((t) => getChildNodeIds(TOPIC_TREE_DATA, t));
    console.log(data, nodeId, "ddd");
    getQuestionsFromBank(
      {
        topics: (nodeId?.length ? nodeId : data.topics).flat(),
        difficultyLevel: data.difficultyLevel,
        languages: props.languages,
      }
      // {
      //   onSuccess: () => {
      //     message.success("Question Selected");
      //     props.closeModal && props.closeModal();
      //   },
      // }
    );
  };
  useEffect(() => {
    setSelectedRowKeys(props?.items?.map((i) => i?._id) || []);
    setSelectedRows(props.items || []);
  }, [props.items]);
  return (
    <Row style={{ overflowX: "scroll" }}>
      <Col span={24}>
        <Title level={4}>Total Question - {selectedRows.length}</Title>
        <Form
          layout="vertical"
          initialValues={{
            // difficultyLevel: "",
            languages: props.languages,
          }}
          onFinish={submit}
          form={form}
        >
          <TopicSelect
            level={2}
            label="Topics"
            notDisabled
            topicId={props.topics}
            name="topics"
            multiple
          />
          {/* <Form.Item label="Select Languages" name="languages">
            <Select mode="multiple" options={Constants.LANGUAGES} />
          </Form.Item> */}
          <Form.Item label="Difficulty Level" name={"difficultyLevel"}>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              options={[
                ...QUESTION_DIFFICULTY_LEVELS,
                // { label: "Ignore Level", value: "" },
              ]}
            />
          </Form.Item>
          <Row justify={"end"}>
            <Col>
              <Button onClick={form.submit} loading={isLoading} type="primary">
                Search Question Bank
              </Button>
            </Col>
          </Row>

          {data?.length ? (
            <Row>
              <Col span={24}>
                <Table
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys,
                    onChange: (selectedKeys, selectedRows) => {
                      setSelectedRowKeys(selectedKeys);
                      setSelectedRows(selectedRows);
                    },
                    getCheckboxProps: (record) => ({
                      disabled: props.itemCount === selectedRows.length, // Disable checkbox for rows where age is less than 40
                    }),
                  }}
                  searchFields={["title.text.eng"]}
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
                        <p
                          onClick={() => {
                            if (!props.multiple && props.onSelect) {
                              props.onSelect(record);
                              message.success("Question Selected");
                              props.closeModal && props.closeModal();
                            }
                          }}
                        >
                          <HtmlViewer content={titleText} />
                        </p>
                      );
                    }}
                  />
                  <TableColumn
                    key={"diff-tag"}
                    title="Title"
                    render={(_: any, record: Types.TestQuestion) => (
                      <DifficultyLevelTag
                        difficultyLevel={record.difficultyLevel}
                      />
                    )}
                  />
                  <TableColumn
                    key={"topic"}
                    title="Topic"
                    render={(_: any, record: Types.TestQuestion) => (
                      <TopicTag id={record.topic} />
                    )}
                  />
                  <TableColumn
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
                  />
                </Table>
              </Col>
              {props.multiple ? (
                <Col
                  span={24}
                  style={{ flexDirection: "row", justifyContent: "end" }}
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log(selectedRows, "111");
                      props.onSelect && props.onSelect(selectedRows);
                      props.closeModal && props.closeModal();
                    }}
                  >
                    Save Selection
                  </Button>
                </Col>
              ) : null}
            </Row>
          ) : null}
        </Form>
      </Col>
    </Row>
  );
};

function getChildNodeIds(tree: any[], id: string): string[] {
  let result: string[] = [];

  function findNodeAndCollectIds(nodes: any[], id: string): boolean {
    for (let node of nodes) {
      if (node._id === id) {
        collectIds(node);
        return true;
      }
      if (node.children) {
        const found = findNodeAndCollectIds(node.children, id);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  function collectIds(node: Node): void {
    if (node.children) {
      for (let child of node.children) {
        result.push(child._id);
        collectIds(child);
      }
    }
  }

  findNodeAndCollectIds(tree, id);
  return result;
}

export const DifficultyLevelTag = (props: { difficultyLevel: string }) => {
  const DiffTag = useMemo(() => {
    switch (props.difficultyLevel) {
      case "easy": {
        return <Tag color="orange-inverse">Easy</Tag>;
        break;
      }

      case "medium": {
        return <Tag color="purple-inverse">Medium</Tag>;
        break;
      }

      case "difficult": {
        return <Tag color="red-inverse">Difficult</Tag>;
        break;
      }
    }
  }, [props.difficultyLevel]);
  return DiffTag;
};

function TopicTag({ id }: { id: string }) {
  const { data: topics } = User.Queries.useGetTopics();
  return topics.find((t) => t._id === id)?.title;
}
