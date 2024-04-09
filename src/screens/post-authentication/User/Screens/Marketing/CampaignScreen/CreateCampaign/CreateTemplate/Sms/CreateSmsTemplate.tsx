import { Button, Col, Divider, Form, Input, Popover, Row } from "@Lib/index";
import { Types, User } from "@adewaskar/lms-common";
import { useLayoutEffect, useState } from "react";

import GenerateWithAi from "../GenerateWithAi";
import PreviewSmsTemplate from "@User/Screens/Marketing/Templates/Sms/PreviewSmsTemplate";
import TextArea from "@Components/Textarea";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";

const { useWatch } = Form;

interface CreateSmsTemplatePropsI {
  // campaign: Types.Campaign;
  // updateCampaign: (d: Types.Campaign) => void;
}

// const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateSmsTemplate = (props: CreateSmsTemplatePropsI) => {
  const form = Form.useFormInstance();
  const campaign = Form.useWatch(form);
  const content = useWatch(["recipients", "segment", "sms", "body"], form);
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <GenerateWithAi
            channel="sms"
            campaign={campaign}
            onComplete={(D) => {
              form.setFieldValue(["recipients", "segment", "sms"], D);
            }}
          />
          <Divider />
          <>
            {/* <Form.Item name={['sms','subject']} required>
           <TextArea label="Subject" name={['sms','subject']} />
        </Form.Item> */}
            <Form.Item
              name={["sms", "body"]}
              label="Sms Body"
              rules={[{ required: true, message: "Please input sms body!" }]}
            >
              <TextArea name={["sms", "body"]} />
            </Form.Item>
          </>
        </Col>
        <Col span={12}>
          <PreviewSmsTemplate content={content} />
        </Col>
      </Row>
    </>
  );
};

export default CreateSmsTemplate;
