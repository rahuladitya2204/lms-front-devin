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
      props.mode === "global" ? "useCreateGlobalPlan" : "useCreateProductPlan"
    ]();
  const planId = props?.plan?._id || "";
  const { mutate: updateTestPlan, isLoading: isUpdating } =
    User.Queries[
      props.mode === "global" ? "useUpdateGlobalPlan" : "useUpdateProductPlan"
    ](planId);

  const { product } = props;

  useEffect(() => {
    form.setFieldsValue(props.plan);
  }, [props.plan]);

  const onSubmit = (e: Types.Plan) => {
    e.mode = props.mode;
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
      updateTestPlan(body, {
        onSuccess: () => {
          message.success("Saved Plan Details");
          props.onSuccess && props.onSuccess();
          props.closeModal && props.closeModal();
        },
      });
    } else {
      createTestPlan(body, {
        onSuccess: () => {
          message.success("Saved Plan Details");
          form.resetFields();
          props.onSuccess && props.onSuccess();
          props.closeModal && props.closeModal();
        },
      });
    }
  };

  const planType = Form.useWatch("type", form);

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item label="Plan Name" required name="title">
        <Input placeholder="Enter plan title" />
      </Form.Item>

      <Form.Item label="Plan Type" name="type">
        <Radio.Group>
          <Radio.Button value="free">Free</Radio.Button>
          <Radio.Button value="one-time">One Time Payment</Radio.Button>
          <Radio.Button value="subscription">Recurring Subscription</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {planType === "subscription" ? (
        <>
          <Col span={24}>
            <Form.Item
              label="Grace Period"
              name={['gracePeriod']}
              rules={[{ required: true, message: "Type name" }]}
            >
              <Input type='number' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Trial Period"
              name={['trial', 'days']}
              rules={[{ required: true, message: "Type name" }]}
            >
              <Input type='number' />
            </Form.Item>
          </Col>
          <Divider />
          <Form.List name="subscriptions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[20, 20]} align="middle">
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="Subscription Name"
                        name={[name, "title"]}
                        rules={[{ required: true, message: "Type name" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="Duration (days)"
                        name={[name, "duration"]}
                        rules={[{ required: true, message: "Enter duration" }]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="Price"
                        name={[name, "price", "value"]}
                        rules={[{ required: true, message: "Enter price" }]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>

                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        label="Auto Renew"
                        name={[name, "autoRenew"]}
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Button type="link" danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                  + Add Subscription Option
                </Button>
              </>
            )}
          </Form.List>
        </>
      ) : null}

      <Row>
        <Col span={24}>
          <Button
            key="submit"
            type="primary"
            loading={isCreating || isUpdating}
            onClick={() => form.submit()}
          >
            {planId ? "Update Plan" : "Save Plan"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default CreatePlan;
