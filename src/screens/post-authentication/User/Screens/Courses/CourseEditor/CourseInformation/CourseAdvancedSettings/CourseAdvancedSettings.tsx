import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import { Fragment, useLayoutEffect } from "react";
import { convertToCommaSeparated, deepPatch } from "../../CourseBuilder/utils";

import CourseCertificate from "./CourseCertificate/CourseCertificateScreen";
import GenerateWithAI from "../GenerateWithAiButton";
import InputTags from "@Components/InputTags/InputTags";
import TextArea from "@Components/Textarea";
import { Types } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";

const { Title } = Typography;
const { useWatch } = Form;

const VARIABLES = [
  {
    name: "Course Title",
    value: "course.title",
  },
  {
    name: "Course User",
    value: "course.user.name",
  },
  {
    name: "Learner Name",
    value: "title",
  },
  {
    name: "Course Release Date",
    value: "course.enrolledAt",
  },
];

const { Paragraph } = Typography;
interface CourseAdvancedSettingsPropsI {
  // courseId: string;
  // saveCourse: Function;
  // course: Types.Course;
}

function CourseAdvancedSettings(props: CourseAdvancedSettingsPropsI) {
  const form = Form.useFormInstance();
  const sendEmail = useWatch(["email", "enabled"], form);

  return (
    <>
      <>
        <Form.Item valuePropName="checked" name={["watermark", "enabled"]}>
          <Checkbox>Enable Water Mark</Checkbox>
        </Form.Item>

        <Card
          bordered={false}
          bodyStyle={{
            display: sendEmail ? "block" : "none",
          }}
          title={<Title level={3}>Email Notification</Title>}
          extra={
            <Tooltip
              placement="topLeft"
              title={`Send email to learner on course enrollment`}
            >
              <Form.Item
                style={{ margin: 0 }}
                valuePropName="checked"
                name={["email", "enabled"]}
              >
                <Switch />
              </Form.Item>
            </Tooltip>
          }
        >
          {sendEmail ? (
            <Fragment>
              <Form.Item name={["email", "subject"]} label="Email Subject">
                <Input />
              </Form.Item>

              <Form.Item name={["email", "cc"]} label="Add Cc">
                <Input />
              </Form.Item>
              <Form.Item
                name={["email", "content"]}
                required
                label="Email Body"
              >
                <TextArea
                  html
                  variables={VARIABLES}
                  height={300}
                  name={["email", "content"]}
                />
              </Form.Item>
            </Fragment>
          ) : null}
        </Card>
        <Divider />
        <Form.Item style={{ marginTop: 20 }}>
          <Row>
            <Col style={{ width: 200 }}>
              <Button type="primary" danger>
                Delete Course
              </Button>
            </Col>
            <Col flex={1}>
              <Paragraph style={{ marginTop: 20 }}>
                This will permanently delete your course. Though Learners who
                have purchased it will continue to have access till their
                subscription ends.
              </Paragraph>
            </Col>
          </Row>
        </Form.Item>
      </>
    </>
  );
}

export default CourseAdvancedSettings;
