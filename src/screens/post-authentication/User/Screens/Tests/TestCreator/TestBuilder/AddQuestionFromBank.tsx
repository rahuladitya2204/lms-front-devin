import {
  Button,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Tag,
  Tree,
  TreeSelect,
  Typography,
  message,
} from "antd";
import { Constants, Enum, Types, User, Utils } from "@adewaskar/lms-common";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { htmlToText } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useBuildTopicTree } from "../TestInformation/TestDetailsEditor/TestDetails";
import TopicSelect from "@Components/TopicSelect";
import { Text, Title } from "@Components/Typography/Typography";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { NavLink } from "@Router/index";
import Link from "antd/es/typography/Link";
import { cloneDeep } from "lodash";

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
  category: string;
  items: Types.TestQuestion[];
  testId: string;
  itemCount: number;
  multiple?: boolean;
  languages: string[];
}) => {
  const { data: TOPIC_TREE_DATA } = useBuildTopicTree(props.topics, 4, true);
  const { data: treeData, isLoading: loadingTopicTree } =
    User.Queries.useGetTopicTree(props.topics, 4);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [questionsPerTopic, setQuestionsPerTopic] = useState({});
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [form] = Form.useForm();
  const {
    mutate: getQuestionsFromBank,
    isLoading,
    data,
  } = User.Queries.useGetQuestionsFromBank();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const submit = (data) => {
    const nodeId = data.topics.map((t) => getChildNodeIds(TOPIC_TREE_DATA, t));
    console.log(data, nodeId, "ddd");
    setSelectedTopics(data.topics);
    getQuestionsFromBank(
      {
        topics: (nodeId?.length
          ? [...nodeId, ...data.topics]
          : data.topics
        ).flat(),
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

  const questionsPerTopic = useMemo(() => {
    const newQuestionsPerTopic = {};
    const topicHierarchy = new Map();

    // Build a map of child to parent relationships
    const buildTopicHierarchy = (nodes, parent = null) => {
      nodes.forEach((node) => {
        topicHierarchy.set(node._id, parent ? parent._id : null);
        if (node.children) {
          buildTopicHierarchy(node.children, node);
        }
      });
    };

    buildTopicHierarchy(TOPIC_TREE_DATA);

    // Initialize counts
    const initializeCounts = (nodes) => {
      nodes.forEach((node) => {
        newQuestionsPerTopic[node._id] = 0;
        if (node.children) {
          initializeCounts(node.children);
        }
      });
    };

    initializeCounts(TOPIC_TREE_DATA);

    // Function to increment count for a topic and all its ancestors
    const incrementCount = (topicId) => {
      let currentId = topicId;
      while (currentId) {
        newQuestionsPerTopic[currentId]++;
        currentId = topicHierarchy.get(currentId);
      }
    };

    // Count questions
    selectedRows.forEach((question) => {
      if (topicHierarchy.has(question.topic)) {
        incrementCount(question.topic);
      }
    });

    return newQuestionsPerTopic;
  }, [selectedRows, TOPIC_TREE_DATA]);

  const handleRowSelection = useCallback(
    (
      newSelectedRowKeys: React.Key[],
      newSelectedRows: Types.TestQuestion[],
      currentFilteredData: Types.TestQuestion[]
    ) => {
      setSelectedRowKeys((prevKeys) => {
        const currentFilteredKeys = new Set(
          currentFilteredData.map((row) => row._id)
        );
        const newKeysSet = new Set(newSelectedRowKeys);

        // Keep previously selected keys that are not in the current filtered data
        const keysToKeep = prevKeys.filter(
          (key) => !currentFilteredKeys.has(key)
        );

        // Add newly selected keys
        return [...new Set([...keysToKeep, ...newSelectedRowKeys])];
      });

      setSelectedRows((prevRows) => {
        const prevRowsMap = new Map(prevRows.map((row) => [row._id, row]));
        const currentFilteredRowsMap = new Map(
          currentFilteredData.map((row) => [row._id, row])
        );

        // Update or add newly selected rows
        newSelectedRows.forEach((row) => prevRowsMap.set(row._id, row));

        // Remove deselected rows that are in the current filtered data
        currentFilteredData.forEach((row) => {
          if (!newSelectedRowKeys.includes(row._id)) {
            prevRowsMap.delete(row._id);
          }
        });

        return Array.from(prevRowsMap.values());
      });
    },
    []
  );

  useEffect(() => {
    if (TOPIC_TREE_DATA) {
      updateTopicCounts(TOPIC_TREE_DATA, questionsPerTopic);
    }
  }, [questionsPerTopic, TOPIC_TREE_DATA]);

  useEffect(() => {
    const D = props?.items?.filter((i) => data?.find((d) => d._id === i._id));
    setSelectedRowKeys(D?.map((i) => i?._id) || []);
    setSelectedRows(D || []);
  }, [props.items, data]);

  const { data: NEW_TOPIC_TREE_DATA } = useBuildTopicTree(
    props.topics,
    2,
    true
  );

  const handleTreeSelect = (checkedKeys, info) => {
    console.log("Checked Keys:", checkedKeys);
    console.log("Checked Nodes:", info.checkedNodes);

    const selectedTopicIds = info.checkedNodes
      .map((node) => node._id)
      .filter(Boolean);

    console.log("Selected Topic IDs:", selectedTopicIds);

    const expandedTopicIds = selectedTopicIds.flatMap((id) => {
      console.log("Processing node with ID:", id);
      console.log(
        "Node data:",
        treeData.find((node) => node._id === id)
      );
      const childIds = getChildNodeIds(treeData, id);
      console.log(`Child IDs for ${id}:`, childIds);
      return [id, ...childIds];
    });

    console.log("Expanded Topic IDs:", expandedTopicIds, data);

    // setSelectedTopics(selectedTopicIds);

    if (!data || !Array.isArray(data)) {
      console.warn("Data is not available or not an array");
      return;
    }

    const filteredQuestions = data.filter((item) =>
      expandedTopicIds.includes(item.topic)
    );

    console.log("Filtered Questions Count:", filteredQuestions.length);
    console.log(
      "Sample Question Topics:",
      filteredQuestions.slice(0, 5).map((q) => q.topic)
    );
    if (filteredQuestions.length) {
      setFilteredData(filteredQuestions);
    }
  };

  // Using useMemo to create a memoized tree with updated counts
  const updatedTopicTreeData = useMemo(() => {
    if (!NEW_TOPIC_TREE_DATA) return [];
    return getUpdatedTopicTreeWithCounts(
      NEW_TOPIC_TREE_DATA,
      questionsPerTopic
    );
  }, [NEW_TOPIC_TREE_DATA, questionsPerTopic]);
  const { data: tests, isFetching: loading } = User.Queries.useGetTests({
    status: [
      // Enum.TestStatus.DRAFT,
      // Enum.TestStatus.PUBLISHED,
      // Enum.TestStatus.IN_PROGRESS,
      Enum.TestStatus.LIVE,
    ],
    category: props.category,
  });

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
          <Form.Item label="Select Topics">
            <Tree
              checkable
              onCheck={handleTreeSelect} // Add this handler to filter data
              treeData={updatedTopicTreeData.filter((i) =>
                selectedTopics.includes(i._id)
              )} // Use updated tree data with counts
              defaultExpandAll
              style={{ maxHeight: 300, overflowY: "auto" }}
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
                  extra={[
                    <Button
                      onClick={() => handleRowSelection([], [], filteredData)}
                    >
                      Reset Selection
                    </Button>,
                  ]}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys,
                    onChange: (newSelectedRowKeys, newSelectedRows) =>
                      handleRowSelection(
                        newSelectedRowKeys,
                        newSelectedRows,
                        filteredData
                      ),
                    getCheckboxProps: (record) => ({
                      disabled: props.itemCount === selectedRows.length, // Disable checkbox for rows where age is less than 40
                    }),
                  }}
                  searchFields={props.languages.map(
                    (lang) => `title.text.${lang}`
                  )}
                  rowKey={"_id"}
                  dataSource={filteredData}
                >
                  <TableColumn
                    key={"title"}
                    title="Title"
                    render={(_: any, record: Types.TestQuestion) => {
                      const titleText = Object.keys(record.title.text)
                        .map((t) => record.title.text[t])
                        .filter((t) => t)[0];
                      return (
                        <Typography.Link
                          onClick={() => {
                            window.open(
                              `/admin/products/test/${record.testId}/builder/${record._id}`
                            );
                          }}
                        >
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
                        </Typography.Link>
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
                    // filterDropdown={({
                    //   setSelectedKeys,
                    //   selectedKeys,
                    //   confirm,
                    // }) => (
                    //   <div style={{ padding: 8, width: 300 }}>
                    //     <Tree
                    //       checkable
                    //       onCheck={(checkedKeys) => {
                    //         setSelectedKeys(
                    //           Array.isArray(checkedKeys)
                    //             ? checkedKeys
                    //             : checkedKeys.checked
                    //         );
                    //       }}
                    //       checkedKeys={selectedKeys}
                    //       treeData={NEW_TOPIC_TREE_DATA.filter((t) =>
                    //         selectedTopics.includes(t._id)
                    //       )}
                    //       defaultExpandAll
                    //       style={{ maxHeight: 300, overflowY: "auto" }}
                    //     />
                    //     <Button
                    //       type="primary"
                    //       onClick={() => confirm()}
                    //       size="small"
                    //       style={{ width: 90, marginTop: 8 }}
                    //     >
                    //       Apply
                    //     </Button>
                    //   </div>
                    // )}
                    // onFilter={(value, record) => {
                    //   console.log("Filter value:", value);

                    //   // Create a mapping of tree keys to topic IDs
                    //   const keyToIdMap = new Map();
                    //   const mapKeys = (node, key = "0") => {
                    //     keyToIdMap.set(key, node._id);
                    //     if (node.children) {
                    //       node.children.forEach((child, index) =>
                    //         mapKeys(child, `${key}-${index}`)
                    //       );
                    //     }
                    //   };
                    //   NEW_TOPIC_TREE_DATA.forEach((node, index) =>
                    //     mapKeys(node, `${index}`)
                    //   );

                    //   console.log(
                    //     "Key to ID Map:",
                    //     Object.fromEntries(keyToIdMap)
                    //   );

                    //   // Function to get all descendant keys for a given key
                    //   const getDescendantKeys = (key) => {
                    //     return Array.from(keyToIdMap.keys()).filter(
                    //       (k) => k.startsWith(key) && k !== key
                    //     );
                    //   };

                    //   // Ensure value is always an array
                    //   const selectedKeys = Array.isArray(value)
                    //     ? value
                    //     : [value];
                    //   console.log("Selected Keys:", selectedKeys);

                    //   // Convert selected keys to actual topic IDs, including descendants
                    //   const selectedTopicIds = selectedKeys
                    //     .reduce((acc, key) => {
                    //       const topicId = keyToIdMap.get(key);
                    //       const descendantKeys = getDescendantKeys(key);
                    //       const descendantIds = descendantKeys.map((k) =>
                    //         keyToIdMap.get(k)
                    //       );
                    //       console.log(
                    //         `For key ${key}: Topic ID: ${topicId}, Descendant IDs: ${descendantIds}`
                    //       );
                    //       return acc.concat(topicId, ...descendantIds);
                    //     }, [])
                    //     .filter(Boolean);

                    //   console.log("Selected Topic IDs:", selectedTopicIds);

                    //   // If no topics are selected, show all records
                    //   if (selectedTopicIds.length === 0) return true;

                    //   // Get all subtopics for each selected topic
                    //   const allSelectedTopicsAndSubtopics =
                    //     selectedTopicIds.reduce((acc, topicId) => {
                    //       const childTopics = getChildNodeIds(
                    //         TOPIC_TREE_DATA,
                    //         topicId
                    //       );
                    //       return acc.concat(childTopics, topicId);
                    //     }, []);

                    //   console.log(
                    //     "All Selected Topics and Subtopics:",
                    //     allSelectedTopicsAndSubtopics
                    //   );
                    //   console.log("Record Topic:", record.topic);

                    //   // Check if the record's topic is included in the full list of selected topics and their subtopics
                    //   return allSelectedTopicsAndSubtopics.includes(
                    //     record.topic
                    //   );
                    // }}
                    render={(_: any, record: Types.TestQuestion) => (
                      <TopicTag id={record.topic} />
                    )}
                  />
                  <TableColumn
                    key={"usedBefore"}
                    title="Used Before"
                    render={(_: any, record: Types.TestQuestion) => {
                      return (
                        <Row>
                          {record.usedBefore
                            .filter((ub) => {
                              const test = tests.find((t) => t._id === ub);
                              return (
                                props.testId !== ub && test?.status === "live"
                              );
                            })
                            .map((ub) => {
                              const test = tests.find((t) => t._id === ub);
                              return (
                                <Col span={24}>
                                  <Link
                                    onClick={() => {
                                      window.open(
                                        `/admin/products/test/${ub}/builder/${record._id}`
                                      );
                                    }}
                                  >
                                    {test?.title || "Test"}
                                  </Link>
                                  <Divider />
                                </Col>
                              );
                            })}
                        </Row>
                      );
                    }}
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

function getChildNodeIds(tree, id) {
  let result = [];

  function traverse(nodes) {
    for (let node of nodes) {
      if (node._id === id) {
        collectChildIds(node);
        return true;
      }
      if (node.children && traverse(node.children)) {
        return true;
      }
    }
    return false;
  }

  function collectChildIds(node) {
    if (node.children) {
      for (let child of node.children) {
        result.push(child._id);
        collectChildIds(child);
      }
    }
  }

  traverse(tree);
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

export function TopicTag({ id }: { id: string }) {
  const { data: topics } = User.Queries.useGetTopics();
  return topics.find((t) => t._id === id)?.title['eng'];
}

interface TopicCount {
  topicId: string;
  count: number;
}

const updateTopicCounts = (treeData, questionsPerTopic) => {
  treeData.forEach((node) => {
    const count = questionsPerTopic[node._id] || 0;
    node.title = `${node.title} (${count})`;
    if (node.children) {
      updateTopicCounts(node.children, questionsPerTopic);
    }
  });
};

const getUpdatedTopicTreeWithCounts = (treeData, questionsPerTopic) => {
  const updatedTree = cloneDeep(treeData); // Create a deep copy to avoid mutating the state

  const updateCounts = (nodes) => {
    nodes.forEach((node) => {
      node.disabled = false;
      // Remove any existing counts from the title and append the new count if greater than zero
      const originalTitle = node?.title['eng']?.split(" (")[0]; // Splits and removes everything after the first ' ('
      const count = questionsPerTopic[node._id] || 0;

      // Append the count only if it's greater than zero
      node.title =
        count > 0 ? (
          <Text strong>
            {originalTitle} ({count})
          </Text>
        ) : (
          originalTitle
        );

      if (node.children) {
        updateCounts(node.children);
      }
    });
  };

  updateCounts(updatedTree);
  return updatedTree;
};