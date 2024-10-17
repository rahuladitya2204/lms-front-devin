import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  message,
} from "@Lib/index";
import { Constants, Types } from "@adewaskar/lms-common";

import { User } from "@adewaskar/lms-common";
import { useEffect } from "react";
import useMessage from "@Hooks/useMessage";

interface CreatePlanPropsI {
  product: Partial<Types.Product>;
  mode: "product" | "global";
  plan?: Types.Plan;
  closeModal?: Function;
  onSuccess?: () => void;
}

function CreatePlan(props: CreatePlanPropsI) {
  const [form] = Form.useForm();

  const { mutate: createTestPlan, isLoading: isCreating } =
    User.Queries[
      props.mode === "product" ? "useCreateProductPlan" : "useCreateGlobalPlan"
    ]();
  const planId = props?.plan?._id || "";
  const { mutate: updateTestPlan, isLoading: isUpdating } =
    User.Queries[
      props.mode === "product" ? "useUpdateProductPlan" : "useUpdateGlobalPlan"
    ](planId);
  const { product } = props;
  useEffect(() => {
    form.setFieldsValue(props.plan);
  }, [props.plan]);
  console.log(props.mode, "okokokok");
  const onSubmit = (e: Types.Plan) => {
    if (props.mode === "global") {
      e.type = "subscription";
    }
    form.validateFields();
    const body: any = {
      data: e,
    };

    if (props.mode === "product") {
      body.product = {
        id: product.id,
        type: product.type,
      };
    }

    if (planId) {
      updateTestPlan(
        {
          ...body,
        },
        {
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Saved Plan Details",
            });
            props.onSuccess && props.onSuccess();
            props.closeModal && props.closeModal();
          },
        }
      );
    } else {
      // @ts-ignore
      createTestPlan(body, {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Saved Plan Details",
          });
          form.resetFields();
          props.onSuccess && props.onSuccess();
          props.closeModal && props.closeModal();
        },
      });
    }
  };
  const trialEnabled = Form.useWatch(
    ["subscription", "trial", "enabled"],
    form
  );

  useEffect(() => {
    if (props?.plan?._id) {
      form.setFieldsValue(props.plan);
    } else {
      form.setFieldsValue({
        ...Constants.INITIAL_COURSE_PLAN_DETAILS,
        mode: props.mode === "global" ? "subscription" : "product",
        type: props.mode === "global" ? "subscription" : undefined, // This line sets the type
      });
    }
  }, [props.mode, props.plan]);

  const planType = Form.useWatch("type", form);

  console.log(planType, "rtpt");
  return (
    <Form
      // initialValues={{
      //   ...Constants.INITIAL_COURSE_PLAN_DETAILS,
      // }}
      form={form}
      onFinish={onSubmit}
      layout="vertical"
    >
      <Form.Item label="Plan Name" required name="title">
        <Input placeholder="Enter plan title" />
      </Form.Item>
      {/* {props.mode === "product" ? ( */}
      <Form.Item label="Plan Type" name="type">
        <Radio.Group>
          <Radio.Button value="free">Free</Radio.Button>
          <Radio.Button value="one-time">One Time Payment</Radio.Button>
          <Radio.Button value={"subscription"}>
            Recurring Subscription
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      {/* ) : null} */}
      {planType === "one-time" || planType === "subscription" ? (
        <Row gutter={[30, 30]}>
          <Col span={12}>
            <Space align="end">
              <Form.Item label="List Price" name={["displayPrice", "unit"]}>
                <Select style={{ width: 70 }} defaultValue="rupee">
                  <Select.Option value="rupee">₹</Select.Option>
                  <Select.Option value="dollar">$</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: 130 }}
                name={["displayPrice", "value"]}
              >
                <Input type="number" />
              </Form.Item>
            </Space>
          </Col>
          <Col span={12}>
            <Space align="end">
              <Form.Item label="Final Price" name={["finalPrice", "unit"]}>
                <Select style={{ width: 70 }} defaultValue="rupee">
                  <Select.Option value="rupee">₹</Select.Option>
                  <Select.Option value="dollar">$</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ width: 130 }} name={["finalPrice", "value"]}>
                <Input type="number" />
              </Form.Item>
            </Space>
          </Col>
        </Row>
      ) : null}
      {planType === "subscription" ? (
        <>
          <Divider />
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Form.Item
                label="Subscription Duration (days)"
                name={["subscription", "duration"]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Subscription Type"
                name={["subscription", "type"]}
              >
                <Select>
                  <Select.Option value="monthly">Monthly</Select.Option>
                  <Select.Option value="yearly">Yearly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Auto Renew"
                name={["subscription", "autoRenew"]}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Grace Period (days)"
                name={["subscription", "gracePeriod"]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Trial Period"
            name={["subscription", "trial", "enabled"]}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          {trialEnabled && (
            <Form.Item
              label="Trial Duration (days)"
              name={["subscription", "trial", "days"]}
            >
              <Input type="number" />
            </Form.Item>
          )}
        </>
      ) : null}
      <Row>
        {" "}
        <Col span={24}>
          <Button
            key="submit"
            type="primary"
            loading={isCreating || isUpdating}
            onClick={() => {
              form.submit();
            }}
          >
            {planId ? "Update Plan" : "Save Plan"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default CreatePlan;
