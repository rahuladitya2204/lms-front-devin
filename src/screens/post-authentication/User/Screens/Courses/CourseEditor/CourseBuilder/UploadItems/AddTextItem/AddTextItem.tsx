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
  Spin,
  Switch,
  Tag,
  Tree,
  TreeSelect,
} from "@Lib/index";
import { Constants, Enum, Types, User, Utils } from "@adewaskar/lms-common";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import InputTags from "@Components/InputTags/InputTags";
import TextArea from "@Components/Textarea";
import { Typography } from "@Components/Typography";
import { useParams } from "@Router/index";
import { useCourseStore } from "../../useCourseStore";
import useUpdateCourseForm from "../useUpdateCourseForm";
import { useOutletContext } from "react-router";

const { confirm } = Modal;

export const QUESTION_DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "difficult", label: "Difficult" },
];

interface CreateQuestionFormPropsI {
  submit?: (d: Types.CourseSectionItem) => void;
  data?: Types.CourseSectionItem;
  closeModal?: Function;
  onFormChange?: (d: Partial<Types.CourseSectionItem>) => void;
}

const AddTextItem: React.FC<CreateQuestionFormPropsI> = (props) => {
  const { itemId, id: courseId } = useParams();
  const language = useCourseStore((s) => s.language);
  // console.log(item, "okokok");
  const { data: course } = User.Queries.useGetCourseDetails(courseId + "");
  // @ts-ignore
  // console.log(language, "language");
  const { data: topics } = User.Queries.useGetTopics();

  const { mutate: deleteSectionItemApi, isLoading: deletingSectionItem } =
    User.Queries.useDeleteCourseSectionItem();
  const DeleteSectionItem = () => {
    confirm({
      title: "Are you sure?",
      content: `You want to delete this section item`,
      onOk() {
        deleteSectionItemApi({
          data: { courseId: courseId + "", itemId: itemId + "" },
        });
      },
      okText: "Delete",
    });
  };

  const prefixKey = `courses/${courseId}/${itemId}`;

  const treeData = course?.topics
    ?.map((topicId) => Utils.buildTopicTree(topics, topicId, 2))
    .flat();
  // console.log(treeData, "treeData");
  const getFormComponent = (language: string) => (
    // <Form
    //   name="course builder"
    //   onFinish={submit}
    //   initialValues={item}
    //   onValuesChange={(changedValues, allValues) => {
    //     // console.log(allValues, "allValues");
    //     onFormChange({
    //       ...allValues,
    //     });
    //   }}
    //   form={form}
    //   layout="vertical"
    // >
    <Row gutter={[10, 0]}>
      <Col span={24}></Col>
      <Col span={24}>
        <Form.Item
          name={["title", "text", language]}
          label="Title"
          required
          rules={[
            {
              required: true,
              message: "Enter questions's title",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              name={["description", "text", language]}
              label="Content"
              required
            >
              <TextArea
                // name={["description", "text", language]}
                uploadPrefixKey={prefixKey}
                height={350}
                html={{ level: 3 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Topic" name="topic">
              <TreeSelect
                treeData={treeData}
                // onExpand={onExpand}
                // expandedKeys={expandedKeys}
                // defaultExpandAll
                // showLine
                // switcherIcon={<DownOutlined />}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tags" name="tags">
              <InputTags name="tags" />
            </Form.Item>
          </Col>
        </Row>
      </Col>
      <Col span={24} style={{ display: "flex", justifyContent: "end" }}>
        <Button type="primary" onClick={DeleteSectionItem} danger>
          Delete Chapter
        </Button>
      </Col>
    </Row>
    // </Form>
  );
  return (
    <Spin spinning={false}>
      {/* <Divider/> */}
      <Card
      // bodyStyle={{
      //   height: 550,
      // }}
      >
        {getFormComponent(language)}
      </Card>
    </Spin>
  );
};

const AddTextItemMemoed = React.memo(AddTextItem);

export default AddTextItemMemoed;
