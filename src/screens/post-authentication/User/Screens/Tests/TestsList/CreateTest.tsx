import { Button, Form, Input, message, Modal, Select } from "@Lib/index";
import { Learner, Types } from "@adewaskar/lms-common";
import React, { ReactNode } from "react";
import slugify from "slugify";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import { useNavigate } from "@Router/index";

interface CreateTestPropsI {
  children?: ReactNode;
  closeModal?: any;
}

const CreateTest: React.FC<CreateTestPropsI> = (props) => {
  const navigate = useNavigate();
  const { mutate: createTest, isLoading: loading } =
    User.Queries.useCreateTest();
  const [form] = Form.useForm();

  const onSubmit = (e: Types.Test) => {
    console.log("Helo", e);
    e.slug = slugify(e.title);
    createTest(e, {
      onSuccess: ({ data: test }) => {
        console.log(test, "here it is");
        // @ts-ignore
        navigate(`/admin/products/test/${test._id}/editor#information`);
        message.open({
          type: "success",
          content: "Have fun creating a Test!",
        });
        props.closeModal && props.closeModal();
      },
    });
  };
  // const { listItems: users } = User.Queries.useGetUsers()
  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        required
        tooltip="Title of your Test"
        rules={[{ required: true, message: "Please mention title for Test" }]}
      >
        <Input placeholder="Enter your test title" />
      </Form.Item>
      <Button
        loading={loading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  );
};

export default CreateTest;
