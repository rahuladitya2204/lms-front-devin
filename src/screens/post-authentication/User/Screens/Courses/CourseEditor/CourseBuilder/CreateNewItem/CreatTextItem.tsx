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
  const onSubmit = ({ title }: { title: { text: Types.LangText } }) => {
    console.log(title, 'huhijoij')
    const item = {
      // ...Constants.INITIAL_COURSE_SECTION_ITEM_DETAILS,
      title: {
        ...title,
        text: {
          ...(Constants.INITIAL_LANG_TEXT),
          ...title.text
        }
      },
      description: {
        text: {
          ...(Constants.INITIAL_LANG_TEXT)
        }
      },
      type: 'text',
      _id: undefined
    };
    props.onFinish &&
      props.onFinish(item);
    form.resetFields(["title"]);
    props.closeModal && props.closeModal();
  };

  const [form] = Form.useForm<{ title: { text: Types.LangText } }>();

  useEffect(() => {
    if (props.item) {
      form.setFieldsValue({
        title: props.item.title,
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
                name={["title", "text", LANGUAGE.value]}
                label="Title"
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
