import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  TreeSelect,
} from "antd";
import { Constants, Enum, Types } from "@adewaskar/lms-common";
import { User, Utils } from "@adewaskar/lms-common";

import ActionModal from "@Components/ActionModal/ActionModal";
import AddUser from "@User/Screens/Users/Users/AddUser";
import CreateCategory from "@User/Screens/Categories/CreateCategory";
import GenerateWithAI from "../GenerateWithAiButton";
import Image from "@Components/Image";
import MediaUpload from "@Components/MediaUpload";
import { PlusOutlined } from "@ant-design/icons";
import SelectProductCategory from "@Components/SelectProductCategory";
import { Typography } from "@Components/Typography";
import { deepPatch } from "../../CourseBuilder/utils";
import { useEffect, useMemo } from "react";
import { useParams } from "@Router/index";
import TopicSelect from "@Components/TopicSelect";
import ValidateProductSlug from "@User/Screens/ExtraComponents/ValidateProductSlug";
import { capitalize } from "lodash";

const { TextArea } = Input;
const { Text } = Typography;

export const DIFFICULTY_LEVELS = [
  {
    label: "Beginner",
    value: "beginner",
  },
  {
    label: "Intermediate",
    value: "intermediate",
  },
  {
    label: "Advanced",
    value: "advanced",
  },
];

const { useWatch } = Form;
const { Option } = Select;
interface CourseDetailsEditorPropsI {

}

function CourseDetailsEditor(props: CourseDetailsEditorPropsI) {
  const form = Form.useFormInstance();
  const { id: courseId } = useParams();
  const { data: users } = User.Queries.useGetUsers();
  const thumbnailImage = useWatch(["thumbnailImage"], form);


  return (
    <>
      <Form.Item name="thumbnailImage" required label="Thumbnail">
        <MediaUpload
          source={{
            type: "course.thumbnailImage",
            value: courseId + "",
          }}
          uploadType="image"
          cropper={{ width: 330, height: 200 }}
          aspect={16 / 9}
          name="thumbnailImage"
          width="200px"
          height="300px"
          prefixKey={`course/${courseId}/thumbnailImage`}
          renderItem={() => <Image preview={false} src={thumbnailImage} />}
          onUpload={(e) => {
            form.setFieldValue(['thumbnailImage'], e.url);
          }}
        />
      </Form.Item>

      <Form.Item
        name="title"
        required
        label="Title"
        rules={[
          { required: true, message: "Please enter a title for the course" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="subtitle"
        required
        label="Subtitle"
        rules={[{ required: true, message: "Please enter a subtitle!" }]}
      // extra={generateWithAI(["subtitle"])}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"description"}
        required
        label="Description"
        rules={[
          {
            required: true,
            message: "Please enter a description for the course",
          },
        ]}
      // extra={generateWithAI(["description"])}
      >
        <TextArea rows={4} placeholder="Enter the course description" />
      </Form.Item>
      <Row gutter={[40, 20]}>
        <Col span={8}>
          <Form.Item
            label="Difficulty Level"
            name={["difficultyLevel"]}
            rules={[
              { required: true, message: "Please select difficulty level!" },
            ]}
          >
            <Select options={DIFFICULTY_LEVELS} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <TopicSelect level={4} name="topics" label="Topics" />
        </Col>

        <Col span={8}>
          <Form.Item
            name="languages"
            required
            label="Languages"
            rules={[{ required: true, message: "Please select a language" }]}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Select Language"
              options={Constants.LANGUAGES}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <ValidateProductSlug product={{
            type: 'course',
            id: courseId + ''
          }} />
        </Col>
        <Col span={8}>
          <SelectProductCategory name={["category"]} />
        </Col>
        <Col span={8}>
          <Form.Item label="Status" style={{ margin: 0 }} name={["status"]}>
            <Select
              options={[
                {
                  label: capitalize(Enum.TestStatus.DRAFT),
                  value: Enum.CourseStatus.DRAFT,
                },
                {
                  label: capitalize(Enum.CourseStatus.PUBLISHED),
                  value: Enum.CourseStatus.PUBLISHED,
                },
                {
                  label: capitalize('live'),
                  value: 'live',
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

export default CourseDetailsEditor;
