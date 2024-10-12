import { Learner, Types } from "@adewaskar/lms-common";
import { Button, Form, Input, Spin, message } from "antd";
import { useEffect } from "react";

export default function BankDetailsForm() {
  const { mutate: updateBankDetails } =
    Learner.Queries.useUpdateAffiliateBankDetails();
  const [form] = Form.useForm();
  const { data: affiliateDetails, isFetching: loadingAffiliateDetails } =
    Learner.Queries.useGetAffiliateAccountDetails();

  useEffect(() => {
    form.setFieldsValue(affiliateDetails.bankDetails);
  }, [affiliateDetails]);

  // On form submission
  const onSubmit = (data: Types.BankDetails) => {
    updateBankDetails(
      { data },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Bank details updated successfully",
          });
        },
      }
    );
  };

  // IFSC Code Validation Pattern (e.g., HDFC0001234)
  const ifscPattern = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;

  // PAN Card Validation Pattern (e.g., ABCDE1234F)
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  return (
    <Spin spinning={loadingAffiliateDetails}>
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        {/* Account Holder Name */}
        <Form.Item
          name="accountName"
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
          name="accountNo"
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
          name="ifscCode"
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
          name="panNo"
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
        <Button block onClick={form.submit} type="primary">
          Update Details
        </Button>
      </Form>
    </Spin>
  );
}
