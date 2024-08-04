import AddMoneyToWallet, {
  useCreateWallterOrder,
} from "@Learner/Screens/Account/LearnerWallet/AddMoneyToWallet";
import { Button, ButtonProps, Modal } from "antd";
import { Enum, Learner, Store, Types, Utils } from "@adewaskar/lms-common";

import ActionModal from "./ActionModal/ActionModal";
import ProductWalletNudge from "./ProductWalletNudge";
import { usePaymentCheckout } from "@Hooks/CommonHooks";
import { useRef } from "react";
import { LogEvent } from "@ServerHooks/useDehydration";

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
  const {
    product: { id, type },
  } = props;
  const { data: prod } = Learner.Queries.useGetProductDetail(props.product);
  const { plan } = prod;
  // console.log(plan, props.product, "hururay");
  const { mutate: createOrder, isLoading: isCreatingOrder } =
    Learner.Queries.useCreateOrderFromProduct();
  // const isSignedIn = Store.useAuthentication(s => s.isSignedIn);
  const { addMoney, isLoading } = useCreateWallterOrder();
  const {
    data: { wallet },
  } = Learner.Queries.useGetLearnerDetails();
  const { mutate: updatePaymentOrder, isLoading: updatingPaymentOrder } =
    Learner.Queries.useUpdateOrderStatus({ id, type });
  const { data: organisation } = Learner.Queries.useGetOrgDetails();
  const transactionStrategy = organisation.transaction.strategy;
  const isFree = plan?.type === "free";
  const onSuccess = (e) => {
    LogEvent(props.product.type, "Enroll::Success", props.product.id); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    props.onSuccess();
  };
  const onError = (e) => {
    LogEvent(props.product.type, "Enroll::Eror", props.product.id); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
  };
  const CreateOrder = () => {
    createOrder(
      { data: { type, id } },
      {
        onSuccess: ({ pgOrder, order }: any) => {
          if (transactionStrategy === Enum.LearnerTransactionStrategy.DIRECT) {
            if (!order.total.value) {
              return updatePaymentOrder(
                {
                  orderId: order._id,
                  status: "successful",
                  data: {},
                },
                {
                  onSuccess: onSuccess,
                  onError,
                }
              );
            }
            openCheckout({ pgOrder, order }, (payment: any) => {
              updatePaymentOrder(
                {
                  orderId: order._id,
                  status: "successful",
                  data: payment,
                },
                {
                  onSuccess: onSuccess,
                  onError,
                }
              );
            });
          }
          if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
            return updatePaymentOrder(
              {
                orderId: order._id,
                status: "successful",
                data: {},
              },
              {
                onSuccess: onSuccess,
                onError,
              }
            );
          }
        },
      }
    );
  };
  return (
    <>
      {plan.finalPrice.value ? (
        <ProductWalletNudge product={props.product} />
      ) : null}
      <Button
        size="large"
        onClick={(e) => {
          LogEvent(props.product.type, "Enroll Attempt", props.product.id); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
          if (plan.finalPrice.value === 0) {
            return CreateOrder();
          }
          if (transactionStrategy === Enum.LearnerTransactionStrategy.WALLET) {
            if (wallet.balance.value < plan.finalPrice.value) {
              const leftAmount = {
                value: plan.finalPrice.value - wallet.balance.value,
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
        }}
        loading={isCreatingOrder || updatingPaymentOrder || isLoading}
        {...props}
      >
        {props.children ||
          (isFree ? (props.ctaText ? props.ctaText : "Enroll Now") : "Buy Now")}
      </Button>
    </>
  );
}
