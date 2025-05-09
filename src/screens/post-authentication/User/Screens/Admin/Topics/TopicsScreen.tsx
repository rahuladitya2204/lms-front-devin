// @ts-nocheck
import { Button, Popconfirm, Skeleton, Tree, message } from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Types, User } from "@adewaskar/lms-common";

import CreateTopic from "@User/Screens/Topics/CreateTopic";
import Header from "@Components/Header";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";

export interface TopicNode extends Types.Topic {
  key: string;
  title: React.ReactNode;
  children?: TopicNode[];
}

export default function TopicsScreen() {
  const {
    data: topics,
    refetch: refetchTopics,
    isLoading: loading,
  } = User.Queries.useGetTopics();
  const { openModal } = useModal();
  const [treeData, setTreeData] = useState<TopicNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    const buildTreeData = (topics: Types.Topic[]): TopicNode[] => {
      return topics
        .filter((topic) => !topic.parentId)
        .map((topic) => ({
          ...topic,
          key: topic._id,
          title: renderTopicTitle(topic),
          children: buildSubTreeData(topic._id, topics),
        }));
    };

    const buildSubTreeData = (
      parentId: string,
      topics: Types.Topic[]
    ): TopicNode[] => {
      const subTopics = topics
        .filter((topic) => topic.parentId === parentId)
        .map((topic) => ({
          ...topic,
          key: topic._id,
          title: renderTopicTitle(topic),
          children: buildSubTreeData(topic._id, topics),
        }));

      const addSubTopicButton: TopicNode = {
        key: `add-${parentId}`,
        title: (
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => onAdd(parentId)}
          >
            Add Subtopic
          </Button>
        ),
        isLeaf: true,
      };

      const editTopicButton: TopicNode = {
        key: `edit-${parentId}`,
        title: (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(topics.find((t) => t._id === parentId))}
          >
            Edit Topic
          </Button>
        ),
        isLeaf: true,
      };

      const deleteTopicButton: TopicNode = {
        key: `delete-${parentId}`,
        title: (
          <Popconfirm
            title="Are you sure to delete this topic?"
            onConfirm={() => onDelete(parentId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              Delete Topic
            </Button>
          </Popconfirm>
        ),
        isLeaf: true,
      };

      return [
        addSubTopicButton,
        editTopicButton,
        deleteTopicButton,
        ...subTopics,
      ];
    };

    const newTreeData = buildTreeData(topics);
    if (JSON.stringify(newTreeData) !== JSON.stringify(treeData)) {
      setTreeData(newTreeData);
    }
  }, [topics]);

  const renderTopicTitle = (topic: Types.Topic) => <span>{topic.title.eng}</span>;

  const onAdd = (parentId: string | null) => {
    openModal(
      <CreateTopic
        parentId={parentId}
        onFinish={() => {
          refetchTopics();
        }}
      />
    );
  };

  const onEdit = (topic: Types.Topic) => {
    openModal(
      <CreateTopic
        data={topic}
        parentId={topic.parentId}
        onFinish={() => {
          refetchTopics();
        }}
      />
    );
  };

  const { mutate: deleteTopic } = User.Queries.useDeleteTopic();
  const onDelete = (id: string) => {
    deleteTopic(
      {
        id,
      },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Topic Deleted Successfully",
          });
        },
      }
    );
    // Implement delete logic here using useDeleteTopic hook
  };

  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys as string[]);
  };

  return (
    <Header title={"Topics"}>
      <div style={{ marginBottom: "16px" }}>
        <Button icon={<PlusOutlined />} onClick={() => onAdd(null)}>
          Add Root Topic
        </Button>
        {/* <Button
          icon={<DeleteOutlined />}
          onClick={onDelete}
          style={{ marginLeft: "8px" }}
        >
          Delete Topic
        </Button> */}
      </div>
      {loading ? (
        <Skeleton.Button active block style={{ height: 90 }} />
      ) : (
        <Tree
          treeData={treeData}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          defaultExpandAll
          showLine
          switcherIcon={<DownOutlined />}
        />
      )}
    </Header>
  );
}
