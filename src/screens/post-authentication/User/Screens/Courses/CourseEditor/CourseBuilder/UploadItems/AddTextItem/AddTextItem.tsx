import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  TreeSelect,
} from "@Lib/index";
import { Types, User } from "@adewaskar/lms-common";
import React, { useEffect } from "react";
import InputTags from "@Components/InputTags/InputTags";
import TextArea from "@Components/Textarea";
import { useParams } from "@Router/index";
import { useCourseStore } from "../../useCourseStore";
import { useOutletContext } from "react-router";
import useUpdateCourseForm from "../useUpdateCourseForm";

const { confirm } = Modal;

interface AddTextItemPropsI {
  language: string;
}

const AddTextItem: React.FC = (props: AddTextItemPropsI) => {
  const { itemId, id: courseId } = useParams();
  // const { language } = props;
  const [, , , language] = useOutletContext(); // Get form and language from context

  const form = Form.useFormInstance();
  const { data: course } = User.Queries.useGetCourseDetails(courseId + "");
  const { data: treeData } = User.Queries.useGetTopicTree(course.topics, 2);

  const DeleteSectionItem = () => {
    // Logic to delete the section item
  };

  const prefixKey = `courses/${courseId}/${itemId}`;

  return (
    <Spin spinning={false}>
      {/* Form is already provided by the parent, so no need to include it here */}
      <Card>
        {/* No need to wrap in another Form, since it's provided in context */}
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Form.Item
              name={["title", "text", language]}
              label="Title"
              required
              rules={[{ required: true, message: "Enter the title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["description", "text", language]}
              label="Content"
              required
            >
              <TextArea
                uploadPrefixKey={prefixKey}
                height={350}
                html={{ level: 3 }}
              />
            </Form.Item>
            {/* Non-language-specific fields */}
            <Form.Item label="Topic" name="topic">
              <TreeSelect treeData={treeData} />
            </Form.Item>
            <Form.Item label="Tags" name="tags">
              <InputTags name="tags" />
            </Form.Item>
            <Button type="primary" onClick={DeleteSectionItem} danger>
              Delete Chapter
            </Button>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

export default React.memo(AddTextItem);
