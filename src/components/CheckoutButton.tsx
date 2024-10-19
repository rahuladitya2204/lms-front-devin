import AddMoneyToWallet, {
  useCreateWallterOrder,
} from "@Learner/Screens/Account/LearnerWallet/AddMoneyToWallet";
import { Button, ButtonProps, Form, Input, Modal } from "antd";
import {
  Constants,
  Enum,
  Learner,
  Store,
  Types,
  Utils,
} from "@adewaskar/lms-common";

import ActionModal from "./ActionModal/ActionModal";
import ProductWalletNudge from "./ProductWalletNudge";
import { usePaymentCheckout } from "@Hooks/CommonHooks";
import { useEffect, useRef, useState } from "react";
import { LogEvent } from "@ServerHooks/useDehydration";
import { capitalize } from "lodash";
import { useSearchParams } from "@Router/index";
import { Text } from "./Typography/Typography";
import { useQueryClient } from "@tanstack/react-query";

const { confirm } = Modal;
interface ProductCheckoutButtonPropsI extends ButtonProps {
  product: {
    type: string;
    id: string;
  };
  ctaText?: string;
  onSuccess: () => void;
}

export default function ProductCheckoutButton(
  props: ProductCheckoutButtonPropsI
) {
  // const {} = Learner.Queries.usegetproductD
  const { openCheckout } = usePaymentCheckout();
  const [form] = Form.useForm();
  const {
    product: { id, type },
  } = props;
  const qc = useQueryClient();
  const [couponValid, setCouponValid] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const couponCodeInput = Form.useWatch(["couponCode"], form);
  const couponCode = searchParams.get("coupon_code") || couponCodeInput;
  const { data: prod } = Learner.Queries.useGetProductDetail(props.product);
  const { plan = Constants.INITIAL_COURSE_PLAN_DETAILS, coupons = [] } = prod;
  const coupon = coupons?.find((c) => c.code === couponCode);
  // console.log(plan, "plplplpl");
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

  const { mutate: createOrder, isLoading: isCreatingOrder } =
    Learner.Queries.useCreateOrderFromProduct();

  const { addMoney, isLoading } = useCreateWallterOrder();
  const {
    data: { wallet },
  } = Learner.Queries.useGetLearnerDetails();

  const isSubscriptionValid =
    Learner.Queries.useIsLearnerSubscriptionValidForProduct(props.product);
  // const { mutate: updatePaymentOrder, isLoading: updatingPaymentOrder } =
  //   Learner.Queries.useUpdateOrderStatus({ id, type });
  const { data: organisation } = Learner.Queries.useGetOrgDetails();
  const transactionStrategy = organisation.transaction.strategy;
  const isFree = plan?.type === "free";
  const onSuccess = () => {
    LogEvent(
      capitalize(props.product.type),
      "Enroll::Success",
      props.product.id
    );
    qc.invalidateQueries([`GET_LEARNER_DETAILS`]);
    // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    props.onSuccess();
  };
  const onError = (e) => {
    LogEvent(capitalize(props.product.type), "Enroll::Eror", props.product.id); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
  };
  const CreateOrder = () => {
    createOrder(
      { data: { type, id, couponCode: coupon } },
      {
        onSuccess: ({ pgOrder, order }: any) => {
          if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
            if (!order.total.value || isSubscriptionValid) {
              onSuccess();
            }
            openCheckout({ pgOrder, order }, (payment: any) => {
              onSuccess();
            });
          }
          if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
            onSuccess();
            // return updatePaymentOrder(
            //   {
            //     orderId: order._id,
            //     status: "successful",
            //     data: {},
            //   },
            //   {
            //     onSuccess: onSuccess,
            //     onError,
            //   }
            // );
          }
        },
      }
    );
  };

  const onFinish = ({ couponCode }) => {
    LogEvent(
      capitalize(props.product.type),
      `Enroll for ${capitalize(props.product.type)}::Clicked`,
      props.product.id,
      {
        productType: props.product.type,
        productId: props.product.id,
      }
    ); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    if (finalPriceValue === 0 || isSubscriptionValid) {
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
          content: `Add ${Utils.UnitTypeToStr(
            leftAmount
          )} and buy this ${type}`,
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
          title: `Are you sure, you want to buy ${props.product.type}`,
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
  if (!prod?.purchase?.enabled) {
    return null;
  }
  return plan._id ? (
    <>
      {finalPriceValue ? <ProductWalletNudge product={props.product} /> : null}
      <Form onFinish={onFinish} form={form} style={{ marginBottom: 10 }}>
        {coupons.length ? (
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
                  const couponExists = coupons?.find(
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
          loading={isCreatingOrder || isLoading}
          {...props}
        >
          {props.children ||
            (isFree
              ? props.ctaText
                ? props.ctaText
                : "Enroll Now"
              : "Buy Now")}
        </Button>
      </Form>
    </>
  ) : null;
}
