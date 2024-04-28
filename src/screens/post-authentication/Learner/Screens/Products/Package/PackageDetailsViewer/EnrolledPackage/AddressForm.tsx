import React, { useEffect, useMemo } from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import { Constants, Learner, Types } from "@adewaskar/lms-common";
import TextArea from "@Components/Textarea";
import { uniq } from "lodash";
import ProtectedLearnerProfile from "@Screens/post-authentication/Learner/Screens/LearnerRoot/ProtectedLearnerProfile";

const { Option } = Select;

interface OrderAddressFormPropsI {
  product: Types.Product;
  closeModal?: Function;
  onSubmit?: (d: Types.LearnerOrderAddress) => void;
}

const OrderAddressForm = (props: OrderAddressFormPropsI) => {
  const [form] = Form.useForm<Types.LearnerOrderAddress>();
  const { data: learner } = Learner.Queries.useGetLearnerDetails();
  const { mutate: updateOrderAddress, isLoading } =
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
  const state = Form.useWatch(["state"], form);

  const CITIES = useMemo(() => {
    return uniq(
      Constants.CITY_LIST.filter((i) => i.state === state).map((i) => i.name)
    );
  }, [Constants.CITY_LIST, state]);

  const STATES = useMemo(() => {
    return uniq(Constants.CITY_LIST.map((i) => i.state));
  }, [Constants.CITY_LIST]);
  console.log(state, CITIES, "sslslslsk");
  return (
    <ProtectedLearnerProfile>
      <Row>
        <Col span={24}>
          <Form
            style={{ width: "100%", marginTop: 20 }}
            form={form}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="line1"
              label="Address Line - 1"
              rules={[
                { required: true, message: "Please enter your line1 address" },
              ]}
            >
              <TextArea rows={2} placeholder="Enter your address" />
            </Form.Item>

            <Form.Item
              name="line2"
              label="Address Line - 2"
              rules={[
                { required: true, message: "Please enter your line2 address" },
              ]}
            >
              <TextArea rows={2} placeholder="Enter your address" />
            </Form.Item>

            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select your state" }]}
            >
              <Select
                showSearch
                options={STATES.map((state) => {
                  return {
                    label: state,
                    value: state,
                  };
                })}
              />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please enter your city" }]}
            >
              <Select
                showSearch
                options={CITIES.map((city) => {
                  return {
                    label: city,
                    value: city,
                  };
                })}
              />
            </Form.Item>

            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[{ required: true, message: "Please enter your pincode" }]}
            >
              <Input placeholder="Enter your pincode" />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoading}
                block
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </ProtectedLearnerProfile>
  );
};

export default OrderAddressForm;
