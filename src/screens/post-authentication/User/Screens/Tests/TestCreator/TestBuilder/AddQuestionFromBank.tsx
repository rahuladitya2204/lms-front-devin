import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  Tree,
  TreeSelect,
  message,
} from "@Lib/index";
import { Constants, Enum, Types, User, Utils } from "@adewaskar/lms-common";
import {
  DeleteTwoTone,
  DownOutlined,
  PlusCircleTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import AppImage from "@Components/Image";
import EnterLatexText from "./EnterLatexText";
import GenerateAIItemDetails from "./GenerateAIItemDetails";
import InputTags from "@Components/InputTags/InputTags";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import MediaUpload from "@Components/MediaUpload";
import Tabs from "@Components/Tabs";
import { Text } from "@Components/Typography/Typography";
import TextArea from "@Components/Textarea";
import { Typography } from "@Components/Typography";
import UploadVideo from "@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoPopup/UploadVideo";
import { useParams } from "@Router/index";
import useTestBuilderUI from "./hooks/useTestBuilder";
import useTestNavigation from "@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation";
import { useTestStore } from "./hooks/useTestStore";
import useUpdateTestForm from "./hooks/useUpdateTest";
import { useBuildTopicTree } from "../TestInformation/TestDetailsEditor/TestDetails";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { htmlToText } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";

const { Title } = Typography;

const { confirm } = Modal;

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
  onSelect: (t: Types.TestQuestion) => void;
  closeModal?: Function;
  topics: string[];
}) => {
  const { data: topics } = User.Queries.useGetTopics();
  const TOPIC_TREE_DATA = props.topics
    .map((topicId) => Utils.buildTopicTree(topics, topicId, 4))
    .flat();
  console.log(TOPIC_TREE_DATA, "TOPIC_TREE_DATA");
  // const TOPIC_TREE_DATA = useBuildTopicTree(props.topicId);
  const [form] = Form.useForm();
  const {
    mutate: getQuestionsFromBank,
    isLoading,
    data,
  } = User.Queries.useGetQuestionsFromBank();

  const submit = (data) => {
    console.log(data, getChildNodeIds(TOPIC_TREE_DATA, data.topics), "ddd");
    getQuestionsFromBank(
      {
        topics: getChildNodeIds(TOPIC_TREE_DATA, data.topics) || [data.topics],
        difficultyLevel: data.difficultyLevel,
      }
      // {
      //   onSuccess: () => {
      //     message.success("Question Selected");
      //     props.closeModal && props.closeModal();
      //   },
      // }
    );
  };
  return (
    <Row>
      <Col span={24}>
        <Form
          initialValues={{
            difficultyLevel: "",
          }}
          onFinish={submit}
          form={form}
        >
          <Form.Item label="Topic" name="topics">
            <TreeSelect
              treeData={TOPIC_TREE_DATA}
              // onExpand={onExpand}
              // expandedKeys={expandedKeys}
              // defaultExpandAll
              // showLine
              // switcherIcon={<DownOutlined />}
            />
          </Form.Item>
          <Form.Item label="Difficulty Level" name={"difficultyLevel"}>
            <Select
              style={{ width: "100%" }}
              options={[
                ...QUESTION_DIFFICULTY_LEVELS,
                { label: "Ignore Level", value: "" },
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
                <Table searchFields={["title.text.eng"]} dataSource={data}>
                  <TableColumn
                    title="Title"
                    render={(_: any, record: Types.TestQuestion) => {
                      const titleText = Object.keys(record.title.text)
                        .map((t) => record.title.text[t])
                        .filter((t) => t)[0];
                      return (
                        <p
                          onClick={() => {
                            props.onSelect(record);
                            message.success("Question Selected");
                            props.closeModal && props.closeModal();
                          }}
                        >
                          {htmlToText(titleText)}
                        </p>
                      );
                    }}
                  />
                  <TableColumn
                    title="Title"
                    render={(_: any, record: Types.TestQuestion) => (
                      <DifficultyLevelTag
                        difficultyLevel={record.difficultyLevel}
                      />
                    )}
                  />
                  <TableColumn
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
