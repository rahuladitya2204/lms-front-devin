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
import Tabs from "@Components/Tabs";

const { Title, Text } = Typography;

export default function SubscriptionPlansModal() {
  const { data: subscriptionPlans, isLoading } =
    Learner.Queries.useGetGlobalPlans();
  const [selectedPlan, setSelectedPlan] = useState<{ plan: Types.Plan, subscription: Types.Subscription }>({
    planId: '',
    subscription: Constants.INITIAL_PLAN_SUBSCRIPTION_PLAN_DETAILS
  });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the modal automatically after 3 seconds
    const timeout = setTimeout(() => {
      setIsModalVisible(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handlePlanSelect = (plan: Types.Plan, subscription: Types.Subscription) => {
    setSelectedPlan({ plan, subscription });
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
        <Col span={24}>
          <Tabs tabKey="subscription-plan" items={subscriptionPlans.map(plan => {
            return {
              key: plan._id,
              label: plan.title,
              children: <Row>
                <Col span={24}>
                  <Row gutter={[20, 20]}>
                    {plan.subscriptions?.map(subscription => {
                      return <Col xs={24} sm={12} md={8} key={plan._id}>
                        <Badge.Ribbon
                        // text={subscription?.type}
                        // color={subscription.autoRenew ? "blue" : "green"}
                        >
                          <Card
                            title={<Title level={4}>{subscription.title}</Title>}
                            bordered
                          // style={{
                          //   border:
                          //     selectedPlan === plan._id
                          //       ? "2px solid #1890ff"
                          //       : "1px solid #d9d9d9",
                          //   borderRadius: "8px",
                          // }}
                          >
                            <Space direction="vertical" size="small">
                              <Text strong>Price: </Text>
                              <Text>
                                {subscription.price.value} {subscription.price.unit}
                              </Text>

                              <Text strong>Duration: </Text>
                              <Text>{subscription.duration} days</Text>

                              {/* <Text strong>Last Updated: </Text>
                  <Text>
                    <ClockCircleOutlined /> {dayjs(plan.updatedAt).format("LL")}
                  </Text> */}

                              <Radio.Group
                                value={selectedPlan.subscription._id}
                                onChange={() => handlePlanSelect(plan, subscription)}
                                style={{ marginTop: "12px", width: "100%" }}
                              >
                                <Radio value={subscription._id} style={{ width: "100%" }}>
                                  Select {subscription.title}
                                </Radio>
                              </Radio.Group>
                            </Space>
                          </Card>
                        </Badge.Ribbon>
                      </Col>
                    })}
                  </Row>
                </Col>
              </Row>
            }
          })} /></Col>
      </Row>

      {(selectedPlan?.subscription?._id) && (
        <Row justify="center" style={{ marginTop: "20px" }}>
          <SubscriptionCheckoutButton
            mode="global"
            global={{
              plan: selectedPlan.plan,
              subscription: selectedPlan.subscription
            }}
          >
            Get{" "} {selectedPlan.plan.title}
            ({
              selectedPlan.subscription.title
            })
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
  global: {
    plan: Types.Plan;
    subscription: Types.Subscription
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
          planId: props?.global?.plan?._id + "",
          subscription: props.global.subscription
        },
      },
      {
        onSuccess: ({ pgOrder, order }: any) => {
          if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
            if (!order.total.value) {
              // return updatePaymentOrder(
              //   {
              //     orderId: order._id,
              //     status: "successful",
              //     data: {},
              //   }
              //   // {
              //   //   onSuccess: onSuccess,
              //   //   onError,
              //   // }
              // );
            }
            openCheckout({ pgOrder, order }, (payment: any) => {
              // updatePaymentOrder(
              //   {
              //     orderId: order._id,
              //     status: "successful",
              //     data: payment,
              //   }
              //   // {
              //   //   onSuccess: onSuccess,
              //   //   onError,
              //   // }
              // );
            });
          }
          if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
            // return updatePaymentOrder(
            //   {
            //     orderId: order._id,
            //     status: "successful",
            //     data: {},
            //   }
            //   // {
            //   //   onSuccess: onSuccess,
            //   //   onError,
            //   // }
            // );
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
          content: `Add ${Utils.UnitTypeToStr(leftAmount)} and buy ${props.global?.plan.title
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
