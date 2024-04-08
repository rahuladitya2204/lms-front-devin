import { Col, Row, Space, Tag, Typography } from "antd";
import { Types, Utils } from "@adewaskar/lms-common";
import { useMemo } from "react";

const { Text } = Typography;

interface PriceCardContentT {
  plan: Types.Plan;
}

export default function PriceCardContent({ plan }: PriceCardContentT) {
  const isPriceSame = plan?.displayPrice?.value === plan?.finalPrice?.value;
  const discount = useMemo(
    () => 100 - (plan.finalPrice.value / plan.displayPrice.value) * 100,
    [plan]
  );
  //   return discount;
  return (
    <Row justify={"space-between"} align={"middle"}>
      <Col>
        {plan?.finalPrice?.value !== 0 ? (
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
                  {Utils.UnitTypeToStr(plan.finalPrice)}
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
  );
}
