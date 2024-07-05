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
import {
  DeleteTwoTone,
  DownOutlined,
  PlusCircleTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import AppImage from "@Components/Image";
import InputTags from "@Components/InputTags/InputTags";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import MediaUpload from "@Components/MediaUpload";
import Tabs from "@Components/Tabs";
import { Text } from "@Components/Typography/Typography";
import TextArea from "@Components/Textarea";
import { Typography } from "@Components/Typography";
import UploadVideo from "@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoPopup/UploadVideo";
import { useParams } from "@Router/index";
import useCourseNavigation from "@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation";
import { useCourseStore } from "../../useCourseScore";
import useUpdateCourseForm from "../useUpdateCourseForm";
import { useOutletContext } from "react-router";

const { Title } = Typography;

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
  const [form] = Form.useForm();

  const [enterHtml, setEnterHtml] = useState(false);
  const { itemId, id: courseId } = useParams();
  const { onFormChange, updateItem } = useUpdateCourseForm(itemId + "");
  const item = useCourseStore((s) => s.currentItem);
  // console.log(item, "okokok");
  const { data: course } = User.Queries.useGetCourseDetails(courseId + "");
  // @ts-ignore
  const [, , , language] = useOutletContext();
  // console.log(language, "language");
  const { data: topics } = User.Queries.useGetTopics();

  useEffect(() => {
    console.log(item, "okokok");
    const i = {
      ...item,
    };
    if (!item.topic) {
      // @ts-ignore
      i.topic = null;
    }
    form.setFieldsValue(i);
  }, [item]);

  const submit = (e: Types.CourseSectionItem) => {
    props.submit && props.submit({ ...e });
    form.resetFields();
    props.closeModal && props.closeModal();
  };
  const { data: file } = User.Queries.useGetFileDetails(
    item?.solution?.video + "",
    {
      enabled: !!item?.solution?.video,
    }
  );

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
    <Form
      name="course builder"
      onFinish={submit}
      initialValues={item}
      onValuesChange={(changedValues, allValues) => {
        // console.log(allValues, "allValues");
        onFormChange({
          ...allValues,
        });
      }}
      form={form}
      layout="vertical"
    >
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
              <Card title="Content">
                <Form.Item name={["description", "text", language]} required>
                  <TextArea
                    uploadPrefixKey={prefixKey}
                    height={350}
                    html={{ level: 3 }}
                  />
                </Form.Item>
              </Card>
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
    </Form>
  );
  return (
    <Spin spinning={false}>
      {/* <Divider/> */}
      <Card>{getFormComponent(language)}</Card>
    </Spin>
  );
};

const AddTextItemMemoed = React.memo(AddTextItem);

export default AddTextItemMemoed;
