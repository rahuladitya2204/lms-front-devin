"use client";
import AddMoneyToWallet, {
  useCreateWallterOrder,
} from "@Learner/Screens/Account/LearnerWallet/AddMoneyToWallet";
import { ButtonProps, Form, Input } from "antd";
import { Constants, Enum, Store, Types, Utils } from "@adewaskar/lms-common";

import { usePaymentCheckout } from "@Hooks/CommonHooks";

import { LogEvent } from "@ServerHooks/useDehydration";
import { capitalize } from "lodash";
import { useSearchParams } from "@Router/index";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Radio,
  Button,
  Typography,
  Space,
  Badge,
  Modal,
} from "@Lib/index";
import { useNavigate } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ProductCheckoutButton from "@Components/CheckoutButton";

const { Title, Text } = Typography;

export default function SubscriptionPlansModal() {
  const { data: subscriptionPlans, isLoading } =
    Learner.Queries.useGetGlobalPlans();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the modal automatically after 3 seconds
    const timeout = setTimeout(() => {
      setIsModalVisible(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Choose Your Subscription Plan"
      visible={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
      centered
      width={800}
    >
      <Row gutter={[16, 16]} justify="center">
        {subscriptionPlans?.map((plan) => (
          <Col xs={24} sm={12} md={8} key={plan._id}>
            <Badge.Ribbon
              text={plan.subscription?.type}
              // color={plan.subscription.autoRenew ? "blue" : "green"}
            >
              <Card
                title={<Title level={4}>{plan.title}</Title>}
                bordered
                style={{
                  border:
                    selectedPlan === plan._id
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  borderRadius: "8px",
                }}
              >
                <Space direction="vertical" size="small">
                  <Text strong>Price: </Text>
                  <Text>
                    {plan.finalPrice.value} {plan.finalPrice.unit}
                  </Text>

                  <Text strong>Duration: </Text>
                  <Text>{plan.subscription.duration} days</Text>

                  {/* <Text strong>Last Updated: </Text>
                  <Text>
                    <ClockCircleOutlined /> {dayjs(plan.updatedAt).format("LL")}
                  </Text> */}

                  <Radio.Group
                    value={selectedPlan}
                    onChange={() => handlePlanSelect(plan._id)}
                    style={{ marginTop: "12px", width: "100%" }}
                  >
                    <Radio value={plan._id} style={{ width: "100%" }}>
                      Select {plan.title}
                    </Radio>
                  </Radio.Group>
                </Space>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      {selectedPlan && (
        <Row justify="center" style={{ marginTop: "20px" }}>
          <SubscriptionCheckoutButton
            mode="global"
            global={{
              plan: subscriptionPlans.find((p) => p._id === selectedPlan),
            }}
          >
            Get{" "}
            {
              subscriptionPlans?.find((plan) => plan._id === selectedPlan)
                ?.title
            }
          </SubscriptionCheckoutButton>
        </Row>
      )}
    </Modal>
  );
}

const { confirm } = Modal;
interface ProductCheckoutButtonPropsI extends ButtonProps {
  mode: "product" | "global";
  product?: {
    type: string;
    id: string;
  };
  global?: {
    plan: Types.Plan;
  };
  ctaText?: string;
  onSuccess: () => void;
}

export function SubscriptionCheckoutButton(props: ProductCheckoutButtonPropsI) {
  const { openCheckout } = usePaymentCheckout();
  const [form] = Form.useForm();
  const { product } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const couponCodeInput = Form.useWatch(["couponCode"], form);
  const couponCode = searchParams.get("coupon_code") || couponCodeInput;
  const { plan = Constants.INITIAL_COURSE_PLAN_DETAILS } = props.global;
  const coupon = plan.coupons?.find((c) => c.code === couponCode);
  const finalPriceValue = Math.ceil(
    coupon
      ? plan.displayPrice.value -
          (plan.displayPrice.value * coupon.discount.value) / 100
      : plan.finalPrice.value
  );

  useEffect(() => {
    if (coupon) {
      form.setFieldValue("couponCode", couponCode);
      if (!searchParams.get("coupon_code")) {
        setSearchParams({
          coupon_code: couponCode,
        });
      }
    }
  }, [coupon, couponCode]);

  const {
    mutate: createSubscriptionPlanOrder,
    isLoading: isCreatingSubscriptionPlanOrder,
  } = Learner.Queries.useCreateGlobalOrder();

  const { addMoney, isLoading } = useCreateWallterOrder();
  const {
    data: { wallet },
  } = Learner.Queries.useGetLearnerDetails();
  const { mutate: updatePaymentOrder, isLoading: updatingPaymentOrder } =
    Learner.Queries.useUpdateOrderStatus(product);
  const { data: organisation } = Learner.Queries.useGetOrgDetails();
  const transactionStrategy = organisation.transaction.strategy;

  const CreateOrder = () => {
    createSubscriptionPlanOrder(
      {
        data: {
          planId: props?.global?.plan?._id,
        },
      },
      {
        onSuccess: ({ pgOrder, order }: any) => {
          if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
            if (!order.total.value) {
              return updatePaymentOrder(
                {
                  orderId: order._id,
                  status: "successful",
                  data: {},
                }
                // {
                //   onSuccess: onSuccess,
                //   onError,
                // }
              );
            }
            openCheckout({ pgOrder, order }, (payment: any) => {
              updatePaymentOrder(
                {
                  orderId: order._id,
                  status: "successful",
                  data: payment,
                }
                // {
                //   onSuccess: onSuccess,
                //   onError,
                // }
              );
            });
          }
          if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
            return updatePaymentOrder(
              {
                orderId: order._id,
                status: "successful",
                data: {},
              }
              // {
              //   onSuccess: onSuccess,
              //   onError,
              // }
            );
          }
        },
      }
    );
  };

  const onFinish = ({ couponCode }) => {
    if (props.product) {
      LogEvent(
        capitalize(props.product.type),
        `Enroll for ${capitalize(props.product.type)}::Clicked`,
        props.product.id,
        {
          productType: props.product.type,
          productId: props.product.id,
        }
      ); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    }
    if (finalPriceValue === 0) {
      return CreateOrder();
    }
    if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
      if (wallet.balance.value < finalPriceValue) {
        const leftAmount = {
          value: finalPriceValue - wallet.balance.value,
          unit: plan.finalPrice.unit,
        };
        confirm({
          closable: false,
          title: `There is insufficient balance in your wallet`,
          // icon: <ExclamationCircleOutlined />,
          content: `Add ${Utils.UnitTypeToStr(leftAmount)} and buy ${
            props.global?.plan.title
          }`,
          // footer: [

          // ],
          onOk() {
            addMoney({
              amount: leftAmount,
              onSuccess: () => {
                console.log("its done, lets create now?");
                CreateOrder();
              },
            });
          },
          okText: "Yes, Purchase",
        });
      } else {
        confirm({
          title: `Are you sure, you want to buy ${props?.product?.type}`,
          // icon: <ExclamationCircleOutlined />,
          content: `Money will be deducted from your wallet`,
          onOk() {
            CreateOrder();
          },
          okText: "Confirm Purchase",
        });
      }
    }
    if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
      CreateOrder();
    }
  };

  // console.log(prod, "prorpo");
  // if (!prod?.purchase?.enabled || props.mode === "global") {
  //   return null;
  // }
  return plan._id ? (
    <>
      <Form onFinish={onFinish} form={form} style={{ marginBottom: 10 }}>
        {plan.coupons.length ? (
          <Form.Item
            help={
              coupon ? (
                <div style={{ marginTop: 5, marginBottom: 10 }}>
                  <Text type="success">Coupon applied successfully!</Text>
                </div>
              ) : (
                ""
              )
            }
            name="couponCode"
            validateStatus={coupon ? "success" : ""}
            rules={[
              // {
              //   required: true,
              //   message: "Please enter a coupon code",
              // },
              // {
              //   type: "number",
              //   min: 1,
              //   max: 99,
              //   message: "Coupon code must be between 1 and 99",
              //   transform: (value) => Number(value), // Transforms the input to a number before validation
              // },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const couponExists = plan.coupons?.find(
                    (c) => c.code === String(value)
                  );
                  if (couponExists) {
                    return Promise.resolve(
                      `${couponCode} applied successfully!`
                    );
                  } else {
                    return Promise.reject(new Error("Coupon is invalid"));
                  }
                },
              },
            ]}
          >
            <Input min={1} max={99} placeholder="Coupon Code" />
          </Form.Item>
        ) : null}

        <Button
          size="large"
          onClick={form.submit}
          loading={
            updatingPaymentOrder || isLoading || isCreatingSubscriptionPlanOrder
          }
          {...props}
        >
          {props.children}
        </Button>
      </Form>
    </>
  ) : null;
}
