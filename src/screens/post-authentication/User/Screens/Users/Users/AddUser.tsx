import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Switch,
} from "@Lib/index";
import { Constants, Enum, Types } from "@adewaskar/lms-common";
import React, { Fragment, ReactNode, useEffect, useState } from "react";

import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";

interface CreateUserComponentPropsI {
  children?: ReactNode;
  data?: Types.User;
  closeModal?: Function;
  onFinish?: (data: Types.User) => void;
}

const AddUser: React.FC<CreateUserComponentPropsI> = (props) => {
  const { mutate: createUser, isLoading: createUserLoading } =
    User.Queries.useCreateUser();
  const { mutate: updateUser, isLoading: updateUserLoading } =
    User.Queries.useUpdateUser();

  const [form] = Form.useForm();
  const onSubmit = (e: Types.CreateUserPayload) => {
    if (props.data) {
      updateUser(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            message.open({
              type: "success",
              content: "User updated successfully",
            });
            props.closeModal && props.closeModal();
          },
          onError: (er: any) => {
            message.open({ type: "error", content: er.response.data.message });
          },
        }
      );
    } else {
      createUser(e, {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "User added successfully",
          });
          props.closeModal && props.closeModal();
        },
        onError: (er: any) => {
          message.open({ type: "error", content: er.response.data.message });
        },
      });
    }
    // onFinish && onFinish(e)
  };

  useEffect(() => {
    form.setFieldsValue(props.data);
  }, [props.data]);

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        rules={[{ required: true, message: "Please enter name of the user" }]}
        name="name"
        label="Name"
        required
      >
        <Input placeholder="Name of the user" />
      </Form.Item>
      {/* <Form.Item
        rules={[
          {
            required: true,
            message: 'Please enter designation of the user'
          }
        ]}
        name="designation"
        label="Designation"
        required
      >
        <Input placeholder="Designation of the user" />
      </Form.Item> */}
      <Form.Item
        label="Mobile Number"
        name="contactNo"
        hasFeedback
        rules={[
          {
            required: true,
            message: `Please enter user's mobile number!`,
          },
          {
            max: 12,
            message: "Contact number should be 10 digits!",
          },
        ]}
      >
        <Input placeholder="Mobile Number of the learner" type="number" />
      </Form.Item>
      {/* 
      <Row justify={"space-between"}>
        <Col span={24}>
          <Form.Item
            valuePropName="checked"
            label="News"
            name={["news", "enabled"]}
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Preferred Language"
            name={["news", "preferredLanguage"]}
          >
            <Select options={Constants.LANGUAGES} />
          </Form.Item>
        </Col>
      </Row> */}

      <Form.Item
        label="Roles"
        name="roles"
        hasFeedback
        rules={[
          {
            required: true,
            message: `Please enter a role!`,
          },
          // {
          //   len: 10,
          //   message: 'Contact number should be 10 digits!'
          // }
        ]}
      >
        <Select
          mode="multiple"
          options={Constants.USER_ROLES.map((i) => {
            return {
              label: i.slug.toUpperCase(),
              value: i.slug,
            };
          })}
        />
      </Form.Item>
      <Button
        loading={createUserLoading || updateUserLoading}
        key="submit"
        htmlType="submit"
        type="primary"
        // onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  );
};

export default AddUser;
