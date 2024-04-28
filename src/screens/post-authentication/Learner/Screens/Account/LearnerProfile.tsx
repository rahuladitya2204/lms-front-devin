import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Spin,
  Tabs,
  message,
} from "antd";
import { Learner, Store, Types } from "@adewaskar/lms-common";

import { ActionModalI } from "@Components/ActionModal/ActionModal";
import MediaUpload from "@Components/MediaUpload";
import { useEffect } from "react";

interface LearnerProfilePropsI extends ActionModalI {}

export default function LearnerProfile(props: LearnerProfilePropsI) {
  const {
    data: { interests },
  } = Learner.Queries.useGetOrgDetails();
  const [form] = Form.useForm();
  const {
    mutate: updateProfile,
    isLoading: updatingProfile,
    // @ts-ignore
  } = Learner.Queries.useUpdateLearnerProfile();
  const { data: learnerDetails, isLoading: loadingDetails } =
    Learner.Queries.useGetLearnerDetails();
  const saveProfile = (d: Partial<Types.Learner>) => {
    updateProfile(
      { data: d },
      {
        onSuccess: () => {
          message.success("Profile details saved");
          props.closeModal && props.closeModal();
        },
        onError: (e: any) => {
          message.error(e.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    form.setFieldsValue(learnerDetails);
  }, [learnerDetails]);

  return (
    <Form onFinish={saveProfile} layout="vertical" form={form}>
      <Form.Item
        rules={[
          {
            required: true,
            message: "Please enter your name",
          },
        ]}
        label="Name"
        name="name"
      >
        <Input placeholder="Please enter your email" />
      </Form.Item>
      {!learnerDetails.email ? (
        <Form.Item
          rules={[
            {
              required: true,
              type: "email",
              message: "Enter a valid email",
            },
          ]}
          label="Email"
          name={["email"]}
        >
          <Input placeholder="Please enter your email" />
        </Form.Item>
      ) : null}

      {!learnerDetails.contactNo ? (
        <Form.Item
          rules={[
            {
              required: true,
              // type: ,
              message: "Enter a contact No",
            },
          ]}
          label="Contact No"
          name={["contactNo"]}
        >
          <Input type="number" placeholder="Please enter your contact number" />
        </Form.Item>
      ) : null}

      {/* {!learnerDetails?.interests?.length ? (
        <Form.Item
          style={{ marginBottom: 50 }}
          rules={[
            {
              required: true,
              // type: ,
              message: 'Please enter a interest'
            }
          ]}
          label="Interests"
          name={['interests']}
        >
          <Select mode="tags" placeholder="Please select your interests">
            {interests.map(interest => {
              // @ts-ignore
              return (
                <Select.Option key={interest._id}>
                  {interest.title}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      ) : null} */}
      <Button block loading={updatingProfile} htmlType="submit" type="primary">
        Save Details
      </Button>
    </Form>
  );
}
