import { Button, Form, Input, Select, TreeSelect } from "antd";
import React, { Fragment, ReactNode, useEffect } from "react";

import TextArea from "@Components/Textarea";
import { Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import { useBuildTopicTree } from "../Tests/TestCreator/TestInformation/TestDetailsEditor/TestDetails";
import TopicSelect from "@Components/TopicSelect";

interface CreateTopicComponentPropsI {
  children?: ReactNode;
  parentId?: string;
  data?: Types.Topic;
  closeModal?: Function;
  onFinish?: (data: Types.Topic) => void;
}

const AddTopic: React.FC<CreateTopicComponentPropsI> = (props) => {
  const { mutate: createTopic, isLoading: createTopicLoading } =
    User.Queries.useCreateTopic();
  const { mutate: updateTopic, isLoading: updateTopicLoading } =
    User.Queries.useUpdateTopic();

  const [form] = Form.useForm();

  const onSubmit = (e: Partial<Types.Topic>) => {
    if (props.data) {
      updateTopic(
        // @ts-ignore
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            form.resetFields();
            props.closeModal && props.closeModal();
          },
        }
      );
    } else {
      createTopic(
        // @ts-ignore
        { data: e },
        {
          onSuccess: () => {
            form.resetFields();
            props.closeModal && props.closeModal();
          },
        }
      );
    }
    // onFinish && onFinish(e)
  };

  useEffect(() => {
    form.setFieldsValue(props.data);
  }, [props.data]);

  useEffect(() => {
    form.setFieldValue(["parentId"], props.parentId);
  }, [props.parentId]);
  return (
    <Fragment>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <TopicSelect
          level={4}
          name="parentId"
          label="Parent Topic"
        ></TopicSelect>
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Topic Title" />
        </Form.Item>

        <Form.Item name={["content", "text"]} label="Content" required>
          <TextArea
            height={300}
            html={{ level: 3 }}
            name={["content", "text"]}
            placeholder="Content"
          />
        </Form.Item>

        <Button
          loading={createTopicLoading || updateTopicLoading}
          key="submit"
          type="primary"
          htmlType="submit"
          // onClick={}
        >
          Submit
        </Button>
      </Form>
    </Fragment>
  );
};

export default AddTopic;
