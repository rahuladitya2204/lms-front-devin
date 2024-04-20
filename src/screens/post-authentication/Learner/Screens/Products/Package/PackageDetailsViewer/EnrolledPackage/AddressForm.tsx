import React, { useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import { Learner, Types } from "@adewaskar/lms-common";
import TextArea from "@Components/Textarea";

const { Option } = Select;

interface OrderAddressFormPropsI {
  product: Types.Product;
  closeModal?: Function;
  onSubmit?: (d: Types.LearnerOrderAddress) => void;
}

const OrderAddressForm = (props: OrderAddressFormPropsI) => {
  const [form] = Form.useForm<Types.LearnerOrderAddress>();
  const { data: learner } = Learner.Queries.useGetLearnerDetails();
  const { mutate: updateOrderAddress } =
    Learner.Queries.useCreateOfflineKitOrder(props.product);
  useEffect(() => {
    if (learner._id) {
      form.setFieldsValue(learner.address);
    }
  }, [learner]);
  const onFinish = (values) => {
    console.log("Form values:", values);
    updateOrderAddress(
      {
        address: values,
      },
      {
        onSuccess: () => {
          props.closeModal && props.closeModal();
        },
      }
    );
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="line1"
        label="Street Address"
        rules={[{ required: true, message: "Please enter your line1 address" }]}
      >
        <TextArea rows={2} placeholder="Enter your address" />
      </Form.Item>

      <Form.Item
        name="line2"
        label="Street Address"
        rules={[{ required: true, message: "Please enter your line2 address" }]}
      >
        <TextArea rows={2} placeholder="Enter your address" />
      </Form.Item>
      <Form.Item
        name="city"
        label="City"
        rules={[{ required: true, message: "Please enter your city" }]}
      >
        <Input placeholder="Enter your city" />
      </Form.Item>

      <Form.Item
        name="state"
        label="State"
        rules={[{ required: true, message: "Please select your state" }]}
      >
        <Input placeholder="Enter your state" />
      </Form.Item>

      <Form.Item
        name="pincode"
        label="Pincode"
        rules={[{ required: true, message: "Please enter your pincode" }]}
      >
        <Input placeholder="Enter your pincode" />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderAddressForm;
