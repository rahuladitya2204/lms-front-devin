import { Button, Form, Input, Modal } from "antd";
import React, { Fragment, useEffect, useState } from "react";

import { AddItemProps } from "../UploadItems/UploadPDF";
import { Constants, Types } from "@adewaskar/lms-common";
import Tabs from "@Components/Tabs";
import { useCourseStore } from "../useCourseStore";

const CreateTextItem: React.FC<Types.CreateItemPropsI> = (
  props: AddItemProps
) => {
  const { languages } = useCourseStore(s => s.course)
  const onSubmit = ({ textHeading }: { textHeading: Types.LangText }) => {
    console.log(textHeading, 'huhijoij')
    props.onFinish &&
      props.onFinish({
        title: {
          ...(Constants.INITIAL_LANG_TEXT),
          ...textHeading
        },
        type: 'text'
      });
    form.resetFields(["textHeading"]);
    props.closeModal && props.closeModal();
  };

  const [form] = Form.useForm<{ textHeading: { text: Types.LangText } }>();

  useEffect(() => {
    if (props.item) {
      form.setFieldsValue({
        textHeading: props.item.title,
      });
    }
  }, [props.item, form]);

  return (
    <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">
      <Tabs
        destroyInactiveTabPane={false}
        items={languages.map((language) => {
          const LANGUAGE = Constants.LANGUAGES.find(lang => lang.value === language);
          return {
            label: LANGUAGE?.label,
            key: LANGUAGE?.value,
            children: (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please mention title for Text Page",
                  },
                ]}
                name={["textHeading", "text", LANGUAGE.value]}
                label="Text Heading"
              >
                <Input />
              </Form.Item>
            ),
          };
        })}
      />

      <Button key="submit" type="primary" onClick={form.submit}>
        Submit
      </Button>
    </Form>
  );
};

export default CreateTextItem;
