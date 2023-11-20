import { Space, Typography } from "antd";
import { Types, Utils } from "@adewaskar/lms-common";

const {Text } = Typography;

interface PriceCardContentT {
    plan: Types.Plan
}

export default function PriceCardContent({plan}: PriceCardContentT) {
    return <Space direction='vertical' align='end' size={0}>
    {plan.type!=='free'?<>
    <Text style={{ textAlign: 'right', textDecoration: 'line-through' }} type='secondary'>
        {Utils.UnitTypeToStr(plan.displayPrice)}</Text>
      <Text style={{fontSize: 18}}>
      {Utils.UnitTypeToStr(plan.finalPrice)}
      </Text></> :
      <Text style={{ fontSize: 16 }}>
      Free
    </Text>}
    </Space>
}