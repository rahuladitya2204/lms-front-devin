import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import { Enum, Learner, Types, User, Utils } from "@adewaskar/lms-common";

import { Typography } from "@Components/Typography";
import { useEffect } from "react";

const { Title } = Typography;

export default function AffiliateProgramForm() {
  const [form] = Form.useForm();
  const {
    data: { affiliate },
    isLoading: loadingSetting,
  } = User.Queries.useGetOrgSetting();
  const { mutate: updateOrgAccount, isLoading: updatingSetting } =
    User.Queries.useUpdateOrgSetting();

  useEffect(() => {
    form.setFieldsValue(affiliate);
  }, [affiliate]);

  const onSubmit = (data: any) => {
    console.log(data, "12121");
    updateOrgAccount(
      {
        data: {
          affiliate: data,
        },
      },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Affiliate program updated successfully",
          });
        },
      }
    );
  };
  const commissionType = Form.useWatch(["commission", "type"], form);
  return (
    <Spin spinning={loadingSetting}>
      <Form
        onValuesChange={console.log}
        onFinish={onSubmit}
        form={form}
        layout="vertical"
      >
        <Row>
          <Col span={24}>
            <Title>
              Affiliate Program Form{" "}
              <Form.Item valuePropName="checked" name={["enabled"]}>
                <Switch />
              </Form.Item>
            </Title>

            <Form.Item label={"Program Name"} name="programName">
              <Input />
            </Form.Item>
            <Title level={3}>Commission</Title>
            <Form.Item label="Committion Type" name={["commission", "type"]}>
              <Select
                options={[
                  { label: "Fixed", value: Enum.CommissionType.FIXED },
                  {
                    label: "Percentage",
                    value: Enum.CommissionType.PERCENTAGE,
                  },
                ]}
              />
            </Form.Item>
            {commissionType === Enum.CommissionType.FIXED ? (
              <Form.Item
                label="Fixed Amount"
                name={["commission", "fixedAmount", "value"]}
              >
                <Input type="number" />
              </Form.Item>
            ) : null}
            {commissionType === Enum.CommissionType.PERCENTAGE ? (
              <Form.Item
                label="Percentage Based"
                name={["commission", "percentage"]}
              >
                <Input />
              </Form.Item>
            ) : null}

            <Title level={3}>Commission Levels</Title>

            <Form.List name="commissionLevels">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ marginBottom: "20px" }}>
                      <Row gutter={16}>
                        <Col span={10}>
                          <Form.Item
                            label="Commission Type"
                            {...restField}
                            name={[name, "type"]}
                          >
                            <Select
                              options={[
                                {
                                  label: "Fixed",
                                  value: Enum.CommissionType.FIXED,
                                },
                                {
                                  label: "Percentage",
                                  value: Enum.CommissionType.PERCENTAGE,
                                },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label={
                              form.getFieldValue([
                                "commissions",
                                name,
                                "type",
                              ]) === Enum.CommissionType.FIXED
                                ? "Fixed Amount"
                                : "Percentage"
                            }
                            {...restField}
                            name={[
                              name,
                              form.getFieldValue([
                                "commissions",
                                name,
                                "type",
                              ]) === Enum.CommissionType.FIXED
                                ? "fixedAmount"
                                : "percentage",
                            ]}
                          >
                            <Input type="number" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%" }}
                    >
                      Add Commission Level
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          <Col span={24}>
            <Button
              loading={updatingSetting}
              onClick={form.submit}
              type="primary"
            >
              Update Details
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
