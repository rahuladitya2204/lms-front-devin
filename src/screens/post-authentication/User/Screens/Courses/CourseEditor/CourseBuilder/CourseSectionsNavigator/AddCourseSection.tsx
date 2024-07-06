import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { Fragment, useEffect, useState } from "react";

import TextArea from "@Components/Textarea";
import { Constants, Types } from "@adewaskar/lms-common";
import { useTestStore } from "@User/Screens/Tests/TestCreator/TestBuilder/hooks/useTestStore";
import Tabs from "@Components/Tabs";

interface AddCourseSectionPropsI {
  closeModal?: Function;
  data?: Types.CourseSection;
  onFinish: (data: Types.CourseSection) => void;
}

const AddCourseSection: React.FC<AddCourseSectionPropsI> = (props) => {
  const updateSection = useTestStore((s) => s.updateSection);
  const [form] = Form.useForm<Types.CourseSection>();
  const { closeModal } = props;
  const onSubmit = (data: Types.CourseSection) => {
    form.resetFields();
    props.onFinish && props.onFinish(data);
    closeModal && closeModal();
  };

  useEffect(() => {
    if (props.data) {
      form.setFieldsValue(props.data);
    }
  }, [props.data, form]);

  return (
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
      <Tabs
        items={Constants.LANGUAGES.map((language) => {
          return {
            label: language.label,
            key: language.value,
            children: (
              <>
                <Form.Item
                  required
                  name={["title", "text", language.value]}
                  label="Section Title"
                >
                  <Input placeholder="Please enter heading for the new section" />
                </Form.Item>

                <Form.Item
                  required
                  name={["description", "text", language.value]}
                  label="Section Detail"
                >
                  <TextArea height={300} html={{ level: 3 }} />
                </Form.Item>
                <Row justify={"end"}>
                  <Col>
                    <Button type="primary" onClick={form.submit}>
                      Save Section
                    </Button>
                  </Col>
                </Row>
              </>
            ),
          };
        })}
      />
    </Form>
  );
};

export default AddCourseSection;
