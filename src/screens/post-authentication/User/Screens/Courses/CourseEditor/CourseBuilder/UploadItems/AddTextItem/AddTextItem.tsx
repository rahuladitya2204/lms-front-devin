import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Switch,
} from "antd";
import { Fragment, useEffect } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Types, User } from "@adewaskar/lms-common";

import ActionModal from "@Components/ActionModal/ActionModal";
import { AddItemProps } from "../UploadPDF";
import FileList from "@Components/FileList";
import InputTags from "@Components/InputTags/InputTags";
import MediaUpload from "@Components/MediaUpload";
import TextArea from "@Components/Textarea";
import { getReadingTime } from "../../utils";
import { uniqueId } from "lodash";
import useUploadItemForm from "../hooks/useUploadItemForm";
import { useOutletContext } from "react-router";
import { useParams } from "@Router/index";
import useUpdateCourseForm from "../useUpdateCourseForm";
import { useCourseStore } from "../../useCourseScore";

const AddTextItem: React.FC<AddItemProps> = (props) => {
  const [form] = Form.useForm();
  const [, , , language] = useOutletContext<
    Types.CourseSection[][]
  >() as unknown as string;
  const { itemId, id: courseId } = useParams();

  const { onFormChange, updateItem } = useUpdateCourseForm(itemId + "");
  const item = useCourseStore((s) => s.currentItem);

  const {
    data: summary,
    mutate: generateInfoApi,
    isLoading: generatingSummary,
  } = User.Queries.useGenerateCourseItemInfo();

  return (
    <Fragment>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changedValues, e) => {
          console.log(e, "eeee");
          const data: Partial<Types.CourseSectionItem> = {
            ...e,
          };
          if (e.description) {
            data.metadata = {
              duration: getReadingTime(e.description),
            };
          }
          console.log(data, "data");
          onFormChange(data);
        }}
      >
        <Form.Item name={["title", "text", language]} label="Title" required>
          <Input placeholder="Enter Text Content's title" />
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={item.isPreview}
            onChange={(e) => {
              const isPreview = e.target.checked;
              onFormChange({ isPreview });
            }}
          >
            Avail this as a free lecture
          </Checkbox>
        </Form.Item>
        {/* <Form.Item
          name="topics"
          label={
            <span>
              Topics{' '}
              <Button
                loading={generatingSummary}
                onClick={() => generateItemInfo(['topics'])}
                type="primary"
                size="small"
              >
                Generate
              </Button>
            </span>
          }
          rules={[{ required: true, message: 'Please input your topics!' }]}
        >
          <InputTags
            name="topics"
            onChange={handleTopicsChange}
            ctaText="Enter Topics"
          />{' '}
        </Form.Item> */}
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card
              style={{ marginBottom: 20 }}
              title="Course Files"
              extra={
                <ActionModal
                  cta={<Button icon={<UploadOutlined />}> Upload Files</Button>}
                >
                  <MediaUpload
                    source={{
                      type: "course.section.item.files",
                      value: courseId + "",
                    }}
                    uploadType="file"
                    prefixKey={`courses/${courseId}/${itemId}/files/${uniqueId()}`}
                    onUpload={({ name, _id }) => {
                      onFormChange({
                        files: [...item.files, { name, file: _id }],
                      });
                    }}
                  />
                </ActionModal>
              }
            >
              <FileList
                onDeleteFile={(fileId: string) => {
                  const files = item.files.filter(
                    (f: any) => f.file !== fileId
                  );
                  onFormChange({ files });
                }}
                files={item.files}
              />
            </Card>
          </Col>
        </Row>
        <Form.Item name={["description", "text", language]} label="Description">
          <TextArea
            name={["description", "text", language]}
            html
            height={700}
          />
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default AddTextItem;
