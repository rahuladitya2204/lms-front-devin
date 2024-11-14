import { Button, Form, Input, message, Modal, Select } from "@Lib/index";
import { Learner, Types } from "@adewaskar/lms-common";
import React, { ReactNode } from "react";

import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import { useNavigate } from "@Router/index";
import slugify from "slugify";

interface CreateCourseComponentPropsI {
  children?: ReactNode;
  closeModal?: any;
}

const CreateCourseComponent: React.FC<CreateCourseComponentPropsI> = (
  props
) => {
  const navigate = useNavigate();
  const { mutate: createCourse, isLoading: loading } =
    User.Queries.useCreateCourse();
  const [form] = Form.useForm();

  const onSubmit = (e: Types.Course) => {
    console.log("Helo");
    // @ts-ignore
    e.slug = slugify(e.title)
    createCourse(e, {
      onSuccess: (course) => {
        navigate(`${course._id}/editor`);
        message.open({
          type: "success",
          content: "Have fun creating a course!",
        });
        props.closeModal && props.closeModal();
      },
    });
  };

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        required
        tooltip="Title of your course"
        rules={[{ required: true, message: "Please mention title for course" }]}
      >
        <Input placeholder="Enter your course title" />
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

export default CreateCourseComponent;
