import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  message,
} from "antd";
import { Constants, Types } from "@adewaskar/lms-common";
import React, { Fragment, ReactNode, useEffect, useState } from "react";

import { User } from "@adewaskar/lms-common";
import {
  ifscPattern,
  panPattern,
} from "@Screens/post-authentication/Learner/Screens/Affiliate/BankDetailsForm";
import { Title } from "@Components/Typography/Typography";

interface CreateAffiliateComponentPropsI {
  children?: ReactNode;
  data?: Types.Affiliate;
  closeModal?: Function;
}

const AddAffiliate: React.FC<CreateAffiliateComponentPropsI> = (props) => {
  const { mutate: createAffiliate, isLoading: createAffiliateLoading } =
    User.Queries.useCreateAffiliate();
  const { mutate: updateAffiliate, isLoading: updateAffiliateLoading } =
    User.Queries.useUpdateAffiliate();

  const [form] = Form.useForm();

  const onSubmit = (e: Types.CreateAffiliatePayload) => {
    if (props.data) {
      updateAffiliate(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal();
          },
        }
      );
    }
    // else {
    //   createAffiliate(
    //     {
    //       data: e,
    //       id: props.learnerId,
    //     },
    //     {
    //       onSuccess: () => {
    //         message.open({
    //           type: "success",
    //           content: "Learned added successfully",
    //         });
    //         props.closeModal && props.closeModal();
    //       },
    //     }
    //   );
    // }
  };

  useEffect(() => {
    form.setFieldsValue(props.data);
  }, [props.data]);

  return (
    <Fragment>
      <Title level={3}>Bank Details</Title>
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        {/* Account Holder Name */}
        <Form.Item
          name={["bankDetails", "accountName"]}
          label="Account Holder Name"
          rules={[
            { required: true, message: "Account Holder Name is required" },
            {
              min: 3,
              message: "Account Holder Name should be at least 3 characters",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Account Number */}
        <Form.Item
          name={["bankDetails", "accountNo"]}
          label="Account Number"
          rules={[
            { required: true, message: "Account Number is required" },
            {
              pattern: /^[0-9]{5,18}$/,
              message: "Account Number should be between 9 to 18 digits",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* IFSC Code */}
        <Form.Item
          name={["bankDetails", "ifscCode"]}
          label="Account IFSC Code"
          rules={[
            { required: true, message: "IFSC Code is required" },
            {
              pattern: ifscPattern,
              message: "Invalid IFSC Code (e.g., HDFC0001234)",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* PAN Card Number */}
        <Form.Item
          name={["bankDetails", "panNo"]}
          label="PAN Card Number"
          rules={[
            { required: true, message: "PAN Card Number is required" },
            {
              pattern: panPattern,
              message: "Invalid PAN Card Number (e.g., ABCDE1234F)",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Submit Button */}
        <Button
          loading={createAffiliateLoading || updateAffiliateLoading}
          block
          onClick={form.submit}
          type="primary"
        >
          Update Affiliate
        </Button>
      </Form>
    </Fragment>
  );
};

export default AddAffiliate;
