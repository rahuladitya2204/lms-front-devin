import { Button, Form, Input, message, Modal, Select } from "antd";
import { Constants, Enum, Types } from "@adewaskar/lms-common";
import React, { Fragment, ReactNode, useEffect, useState } from "react";

import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";

interface AddUserToOrgComponentPropsI {
  children?: ReactNode;
  organisation: string;
  data?: Types.User;
  closeModal?: Function;
  onFinish?: (data: Types.User) => void;
}

const AddUser: React.FC<AddUserToOrgComponentPropsI> = (props) => {
  const { mutate: addUserToOrg, isLoading: addUserToOrgLoading } =
    User.Queries.useAddUserToOrg();
  const [form] = Form.useForm();
  const onSubmit = (e: { name: string; contactNo: string }) => {
    addUserToOrg(
      {
        id: props.organisation,
        data: e,
      },
      {
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
      }
    );
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
        <Input placeholder="Mobile Number of the user" type="number" />
      </Form.Item>
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
        loading={addUserToOrgLoading}
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
