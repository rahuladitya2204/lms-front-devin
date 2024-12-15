import { Col, Row, Space, Tag, Typography } from "antd";
import { useSearchParams } from "@Router/index";
import { Types, Utils } from "@adewaskar/lms-common";
import { useMemo } from "react";

const { Text } = Typography;

interface PriceCardContentT {
  plan: Types.Plan;
  coupons: Types.ProductCoupon[];
}

export default function PriceCardContent({ plan, coupons }: PriceCardContentT) {
  const [searchParams] = useSearchParams();
  const couponCode = searchParams.get("coupon_code");
  const coupon = coupons?.find((c) => c.code === couponCode);

  const finalPriceValue = Math.ceil(
    coupon
      ? plan.displayPrice.value -
      (plan.displayPrice.value * coupon.discount.value) / 100
      : plan.finalPrice.value
  );

  const discount = useMemo(
    () =>
      coupon
        ? coupon.discount.value
        : 100 - (finalPriceValue / plan.displayPrice.value) * 100,
    [plan, coupon]
  );
  const isPriceSame = plan?.displayPrice?.value === finalPriceValue;

  if (!plan?._id) {
    return null;
  }

  return plan._id ? (
    <Row justify={"space-between"} align={"middle"}>
      <Col>
        {finalPriceValue !== 0 ? (
          <>
            <Row>
              <Col span={24}>
                {!isPriceSame ? (
                  <Text
                    style={{
                      textAlign: "right",
                      textDecoration: "line-through",
                    }}
                    type="secondary"
                  >
                    {Utils.UnitTypeToStr(plan.displayPrice)}
                  </Text>
                ) : null}
              </Col>
              <Col span={24}>
                <Text strong style={{ fontSize: 18 }}>
                  {Utils.UnitTypeToStr({
                    value: finalPriceValue,
                    unit: plan.finalPrice.unit,
                  })}
                </Text>
              </Col>
            </Row>
          </>
        ) : (
          <Text style={{ fontSize: 16 }}>Free</Text>
        )}
      </Col>
      <Col>
        {plan.type !== "free" && !isPriceSame ? (
          <Col>
            <Tag color="purple" style={{ marginRight: 0 }}>
              {Math.floor(Number(discount))}% off
            </Tag>
          </Col>
        ) : null}
      </Col>
    </Row>
  ) : null;
}
